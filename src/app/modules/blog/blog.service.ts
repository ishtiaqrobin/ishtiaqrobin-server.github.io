import { prisma } from "../../lib/prisma";
import {
  CreateBlogInput,
  UpdateBlogInput,
  CreateBlogTagInput,
  UpdateBlogTagInput,
  CreateBlogCommentInput,
} from "./blog.interface";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";
import { sendEmail } from "../../utils/email";
import { env } from "../../config/env";

const blogInclude = {
  tags: true,
  comments: {
    where: { isApproved: true, parentId: null },
    include: {
      replies: { where: { isApproved: true } },
    },
    orderBy: { createdAt: "desc" as const },
  },
} as const;

// ── Blog ──────────────────────────────────────────────────

// Create blog
const createBlog = async (payload: CreateBlogInput) => {
  const { tagIds, publishedAt, ...blogData } = payload;

  const result = await prisma.blog.create({
    data: {
      ...blogData,
      ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      ...(tagIds?.length && {
        tags: { connect: tagIds.map((id) => ({ id })) },
      }),
    } as any,
    include: blogInclude,
  });
  return result;
};

// Get all blogs
const getBlogs = async (filters?: {
  status?: string;
  isFeatured?: boolean;
  tagId?: string;
}) => {
  const result = await prisma.blog.findMany({
    where: {
      ...(filters?.status && { status: filters.status as any }),
      ...(filters?.isFeatured !== undefined && {
        isFeatured: filters.isFeatured,
      }),
      ...(filters?.tagId && { tags: { some: { id: filters.tagId } } }),
    },
    include: blogInclude,
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// Get single blog by id
const getBlogById = async (id: string) => {
  const result = await prisma.blog.findUnique({
    where: { id },
    include: blogInclude,
  });

  if (!result) throw new AppError(status.NOT_FOUND, "Blog not found");
  return result;
};

// Get single blog by slug (public — increments viewCount)
const getBlogBySlug = async (slug: string) => {
  const result = await prisma.blog.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
    include: blogInclude,
  });

  if (!result) throw new AppError(status.NOT_FOUND, "Blog not found");
  return result;
};

// Update blog
const updateBlog = async (id: string, payload: UpdateBlogInput) => {
  const current = await prisma.blog.findUnique({ where: { id } });
  if (!current) throw new AppError(status.NOT_FOUND, "Blog not found");

  // Delete old thumbnail from Cloudinary if new one is being uploaded
  if (
    payload.thumbnail &&
    current.thumbnail &&
    payload.thumbnail !== current.thumbnail
  ) {
    await deleteFileFromCloudinary(current.thumbnail);
  }

  const { tagIds, publishedAt, ...updateData } = payload;

  const result = await prisma.blog.update({
    where: { id },
    data: {
      ...updateData,
      ...(publishedAt && { publishedAt: new Date(publishedAt) }),
      // Replace all tags if new ones are provided
      ...(tagIds?.length && {
        tags: { set: tagIds.map((id) => ({ id })) },
      }),
    } as any,
    include: blogInclude,
  });
  return result;
};

// Like blog (increment likeCount)
const likeBlog = async (id: string) => {
  const result = await prisma.blog.update({
    where: { id },
    data: { likeCount: { increment: 1 } },
  });
  return result;
};

// Delete blog
const deleteBlog = async (id: string) => {
  const current = await prisma.blog.findUnique({ where: { id } });
  if (!current) throw new AppError(status.NOT_FOUND, "Blog not found");

  if (current.thumbnail) {
    await deleteFileFromCloudinary(current.thumbnail);
  }

  await prisma.blog.delete({ where: { id } });
};

// ── Blog Tag ──────────────────────────────────────────────

// Create tag
const createBlogTag = async (payload: CreateBlogTagInput) => {
  const result = await prisma.blogTag.create({ data: payload as any });
  return result;
};

// Get all tags
const getBlogTags = async () => {
  const result = await prisma.blogTag.findMany({
    orderBy: { name: "asc" },
  });
  return result;
};

// Update tag
const updateBlogTag = async (id: string, payload: UpdateBlogTagInput) => {
  const result = await prisma.blogTag.update({
    where: { id },
    data: payload as any,
  });
  return result;
};

// Delete tag
const deleteBlogTag = async (id: string) => {
  await prisma.blogTag.delete({ where: { id } });
};

// ── Blog Comment ──────────────────────────────────────────

// Create comment (guest)
const createComment = async (
  payload: CreateBlogCommentInput,
  ipAddress?: string,
) => {
  const result = await prisma.blogComment.create({
    data: { ...payload, ipAddress } as any,
  });
  return result;
};

// Get all comments (admin — including unapproved)
const getComments = async (blogId?: string, isApproved?: boolean) => {
  const result = await prisma.blogComment.findMany({
    where: {
      ...(blogId && { blogId }),
      ...(isApproved !== undefined && { isApproved }),
      parentId: null,
    },
    include: { replies: true },
    orderBy: { createdAt: "desc" },
  });
  return result;
};

// Approve comment
const approveComment = async (id: string) => {
  const result = await prisma.blogComment.update({
    where: { id },
    data: { isApproved: true },
    include: { blog: { select: { title: true, slug: true } } },
  });

  // Notify the commenter that their comment is now live
  if (result.email) {
    try {
      const blogUrl = result.blog?.slug
        ? `${env.FRONTEND_URL}/blogs/${result.blog.slug}`
        : env.FRONTEND_URL;

      await sendEmail({
        to: result.email,
        subject: `Your comment is now live on Ishtiaq Robin's blog`,
        templateName: "blog-comment-approved",
        templateData: {
          name: result.name,
          comment: result.comment,
          blogTitle: result.blog?.title || "the blog",
          blogUrl,
        },
      });
    } catch (err) {
      console.error("Failed to send comment-approved email:", err);
    }
  }

  return result;
};

// Delete comment
const deleteComment = async (id: string) => {
  await prisma.blogComment.delete({ where: { id } });
};

export const BlogService = {
  // Blog
  createBlog,
  getBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  likeBlog,
  deleteBlog,
  //   Tag,
  createBlogTag,
  getBlogTags,
  updateBlogTag,
  deleteBlogTag,
  //   Comment,
  createComment,
  getComments,
  approveComment,
  deleteComment,
};
