import { prisma } from "../../lib/prisma";
import {
  CreateBlogInput,
  UpdateBlogInput,
  BlogFilters,
  CreateBlogTagInput,
  CreateBlogCommentInput,
  BlogCommentFilters,
} from "./blog.interface";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

// ── Helpers ───────────────────────────────────────────────

const blogInclude = {
  tags: true,
  _count: { select: { comments: { where: { isApproved: true } } } },
} as const;

/** "My First Post!" → "my-first-post" */
const slugify = (input: string): string =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // strip non-word chars
    .replace(/[\s_]+/g, "-") // spaces/underscores → dash
    .replace(/-+/g, "-") // collapse dashes
    .replace(/^-|-$/g, ""); // trim dashes

/** Strip HTML tags and count words → reading time in minutes (200 wpm). */
const computeReadingTime = (html: string): number => {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = text ? text.split(" ").length : 0;
  return Math.max(1, Math.ceil(words / 200));
};

/** Ensure the slug is unique; append -2, -3, … on collision. */
const ensureUniqueSlug = async (
  base: string,
  excludeId?: string,
): Promise<string> => {
  const root = base || "post";
  let candidate = root;
  let counter = 1;

  // Cap iterations so a pathological case can't loop forever
  while (counter < 500) {
    const existing = await prisma.blog.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) return candidate;

    counter += 1;
    candidate = `${root}-${counter}`;
  }

  // Fallback — timestamp suffix guarantees uniqueness
  return `${root}-${Date.now()}`;
};

/** Resolve tagIds + tagNames into a Prisma `connect` list, creating missing tags. */
const resolveTags = async (
  tagIds?: string[],
  tagNames?: string[],
): Promise<{ id: string }[]> => {
  const connect: { id: string }[] = [];

  if (tagIds?.length) {
    const found = await prisma.blogTag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true },
    });
    connect.push(...found.map((t) => ({ id: t.id })));
  }

  if (tagNames?.length) {
    for (const rawName of tagNames) {
      const name = rawName.trim();
      if (!name) continue;

      const slug = slugify(name) || `tag-${Date.now()}`;

      // Try by name first, then by slug, else create
      let tag = await prisma.blogTag.findFirst({
        where: { OR: [{ name }, { slug }] },
        select: { id: true },
      });

      if (!tag) {
        tag = await prisma.blogTag.create({
          data: { name, slug },
          select: { id: true },
        });
      }

      if (!connect.some((c) => c.id === tag!.id)) {
        connect.push({ id: tag.id });
      }
    }
  }

  return connect;
};

// ── Blog CRUD ─────────────────────────────────────────────

const createBlog = async (payload: CreateBlogInput) => {
  const {
    tagIds,
    tagNames,
    slug: rawSlug,
    publishedAt,
    readingTime,
    ...rest
  } = payload;

  const slug = await ensureUniqueSlug(slugify(rawSlug || rest.title));
  const tags = await resolveTags(tagIds, tagNames);

  // Auto-set publishedAt when publishing without an explicit date
  const finalStatus = rest.status ?? "DRAFT";
  const finalPublishedAt =
    publishedAt ?? (finalStatus === "PUBLISHED" ? new Date() : null);

  const result = await prisma.blog.create({
    data: {
      ...rest,
      slug,
      status: finalStatus,
      publishedAt: finalPublishedAt,
      readingTime: readingTime ?? computeReadingTime(rest.content),
      ...(tags.length ? { tags: { connect: tags } } : {}),
    } as any,
    include: blogInclude,
  });

  return result;
};

const getBlogs = async (filters: BlogFilters = {}) => {
  const {
    status,
    isFeatured,
    isPinned,
    tagId,
    tagSlug,
    search,
    page = 1,
    limit = 10,
    publicOnly,
  } = filters;

  const where: any = {
    ...(publicOnly ? { status: "PUBLISHED" } : status ? { status } : {}),
    ...(isFeatured !== undefined && { isFeatured }),
    ...(isPinned !== undefined && { isPinned }),
    ...(tagId && { tags: { some: { id: tagId } } }),
    ...(tagSlug && { tags: { some: { slug: tagSlug } } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safePage = Math.max(page, 1);

  const [items, total] = await Promise.all([
    prisma.blog.findMany({
      where,
      include: blogInclude,
      orderBy: [
        { isPinned: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
    }),
    prisma.blog.count({ where }),
  ]);

  return {
    data: items,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
};

const getBlogById = async (id: string) => {
  const result = await prisma.blog.findUnique({
    where: { id },
    include: blogInclude,
  });

  if (!result) throw new AppError(status.NOT_FOUND, "Blog not found");
  return result;
};

/**
 * Public fetch by slug — increments viewCount.
 * Drafts are hidden from the public (404) unless `includeDrafts` is true.
 */
const getBlogBySlug = async (slug: string, includeDrafts = false) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    include: blogInclude,
  });

  if (!blog) throw new AppError(status.NOT_FOUND, "Blog not found");

  if (!includeDrafts && blog.status !== "PUBLISHED") {
    throw new AppError(status.NOT_FOUND, "Blog not found");
  }

  // Fire-and-forget view increment (don't block the response)
  prisma.blog
    .update({ where: { id: blog.id }, data: { viewCount: { increment: 1 } } })
    .catch(() => {
      /* non-critical */
    });

  return { ...blog, viewCount: blog.viewCount + 1 };
};

const updateBlog = async (id: string, payload: UpdateBlogInput) => {
  const current = await prisma.blog.findUnique({ where: { id } });
  if (!current) throw new AppError(status.NOT_FOUND, "Blog not found");

  const {
    tagIds,
    tagNames,
    slug: rawSlug,
    publishedAt,
    readingTime,
    content,
    ...rest
  } = payload;

  // Replace thumbnail on Cloudinary when a new one is uploaded
  if (
    rest.thumbnail &&
    current.thumbnail &&
    rest.thumbnail !== current.thumbnail
  ) {
    await deleteFileFromCloudinary(current.thumbnail);
  }

  // Slug change → re-check uniqueness
  let slug: string | undefined;
  if (rawSlug !== undefined) {
    slug = await ensureUniqueSlug(slugify(rawSlug), id);
  }

  // Tags provided → replace the whole set
  const tagsProvided = tagIds !== undefined || tagNames !== undefined;
  const tags = tagsProvided ? await resolveTags(tagIds, tagNames) : undefined;

  // publishedAt: set on first publish, keep otherwise
  let finalPublishedAt: Date | null | undefined;
  if (publishedAt !== undefined) {
    finalPublishedAt = publishedAt ? new Date(publishedAt) : null;
  } else if (rest.status === "PUBLISHED" && !current.publishedAt) {
    finalPublishedAt = new Date();
  }

  const result = await prisma.blog.update({
    where: { id },
    data: {
      ...rest,
      ...(slug !== undefined && { slug }),
      ...(finalPublishedAt !== undefined && { publishedAt: finalPublishedAt }),
      ...(content !== undefined && {
        content,
        readingTime: readingTime ?? computeReadingTime(content),
      }),
      ...(content === undefined &&
        readingTime !== undefined && { readingTime }),
      ...(tagsProvided && { tags: { set: tags } }),
    } as any,
    include: blogInclude,
  });

  return result;
};

const deleteBlog = async (id: string) => {
  const current = await prisma.blog.findUnique({ where: { id } });
  if (!current) throw new AppError(status.NOT_FOUND, "Blog not found");

  const urls = [current.thumbnail, current.ogImage].filter(Boolean) as string[];
  await Promise.all(urls.map(deleteFileFromCloudinary));

  await prisma.blog.delete({ where: { id } });
};

// ── Likes (IP-based dedup, in-memory) ─────────────────────

// Key: `${blogId}:${ip}` → timestamp of last like
const likeStore = new Map<string, number>();
const LIKE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h

const likeBlog = async (id: string, ipAddress: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
    select: { id: true, likeCount: true },
  });
  if (!blog) throw new AppError(status.NOT_FOUND, "Blog not found");

  const key = `${id}:${ipAddress}`;
  const last = likeStore.get(key);
  const now = Date.now();

  if (last && now - last < LIKE_WINDOW_MS) {
    return {
      liked: false,
      alreadyLiked: true,
      likeCount: blog.likeCount,
      message: "You already liked this post.",
    };
  }

  likeStore.set(key, now);

  const updated = await prisma.blog.update({
    where: { id },
    data: { likeCount: { increment: 1 } },
    select: { likeCount: true },
  });

  return {
    liked: true,
    alreadyLiked: false,
    likeCount: updated.likeCount,
    message: "Thanks for the like!",
  };
};

// ── Tags ──────────────────────────────────────────────────

const getTags = async () => {
  return prisma.blogTag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { blogs: true } } },
  });
};

const createTag = async (payload: CreateBlogTagInput) => {
  const name = payload.name.trim();
  const slug = slugify(payload.slug || name) || `tag-${Date.now()}`;

  const existing = await prisma.blogTag.findFirst({
    where: { OR: [{ name }, { slug }] },
  });
  if (existing) {
    throw new AppError(status.CONFLICT, "Tag already exists");
  }

  return prisma.blogTag.create({ data: { name, slug } });
};

const deleteTag = async (id: string) => {
  const tag = await prisma.blogTag.findUnique({ where: { id } });
  if (!tag) throw new AppError(status.NOT_FOUND, "Tag not found");

  await prisma.blogTag.delete({ where: { id } });
};

// ── Comments ──────────────────────────────────────────────

/** Public — only approved comments, nested one level. */
const getComments = async (blogId: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { id: true },
  });
  if (!blog) throw new AppError(status.NOT_FOUND, "Blog not found");

  const comments = await prisma.blogComment.findMany({
    where: { blogId, isApproved: true, parentId: null },
    orderBy: { createdAt: "desc" },
    include: {
      replies: {
        where: { isApproved: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return comments;
};

/** Admin — every comment regardless of approval. */
const getAllComments = async (filters: BlogCommentFilters = {}) => {
  const { isApproved, page = 1, limit = 20 } = filters;

  const where: any = {
    ...(isApproved !== undefined && { isApproved }),
  };

  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const safePage = Math.max(page, 1);

  const [items, total] = await Promise.all([
    prisma.blogComment.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      include: {
        blog: { select: { id: true, title: true, slug: true } },
      },
    }),
    prisma.blogComment.count({ where }),
  ]);

  return {
    data: items,
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.max(1, Math.ceil(total / safeLimit)),
    },
  };
};

const createComment = async (
  blogId: string,
  payload: CreateBlogCommentInput,
  ipAddress: string,
) => {
  const blog = await prisma.blog.findUnique({
    where: { id: blogId },
    select: { id: true, status: true },
  });
  if (!blog) throw new AppError(status.NOT_FOUND, "Blog not found");
  if (blog.status !== "PUBLISHED") {
    throw new AppError(
      status.BAD_REQUEST,
      "Cannot comment on an unpublished post.",
    );
  }

  // Validate parent belongs to the same blog
  if (payload.parentId) {
    const parent = await prisma.blogComment.findUnique({
      where: { id: payload.parentId },
      select: { blogId: true, parentId: true },
    });
    if (!parent || parent.blogId !== blogId) {
      throw new AppError(status.BAD_REQUEST, "Invalid parent comment.");
    }
    // Only 1 level of nesting
    if (parent.parentId) {
      throw new AppError(
        status.BAD_REQUEST,
        "Replies to replies are not allowed.",
      );
    }
  }

  const result = await prisma.blogComment.create({
    data: {
      blogId,
      name: payload.name,
      email: payload.email,
      comment: payload.comment,
      parentId: payload.parentId ?? null,
      ipAddress,
      isApproved: false,
    },
  });

  return result;
};

const approveComment = async (id: string, isApproved: boolean) => {
  const comment = await prisma.blogComment.findUnique({ where: { id } });
  if (!comment) throw new AppError(status.NOT_FOUND, "Comment not found");

  return prisma.blogComment.update({
    where: { id },
    data: { isApproved },
  });
};

const deleteComment = async (id: string) => {
  const comment = await prisma.blogComment.findUnique({ where: { id } });
  if (!comment) throw new AppError(status.NOT_FOUND, "Comment not found");

  await prisma.blogComment.delete({ where: { id } });
};

// ── Related posts ─────────────────────────────────────────

const getRelatedBlogs = async (slug: string, limit = 3) => {
  const blog = await prisma.blog.findUnique({
    where: { slug },
    select: { id: true, tags: { select: { id: true } } },
  });
  if (!blog) throw new AppError(status.NOT_FOUND, "Blog not found");

  const tagIds = blog.tags.map((t) => t.id);

  return prisma.blog.findMany({
    where: {
      id: { not: blog.id },
      status: "PUBLISHED",
      ...(tagIds.length && { tags: { some: { id: { in: tagIds } } } }),
    },
    include: blogInclude,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
};

export const BlogService = {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  likeBlog,
  getTags,
  createTag,
  deleteTag,
  getComments,
  getAllComments,
  createComment,
  approveComment,
  deleteComment,
  getRelatedBlogs,
};
