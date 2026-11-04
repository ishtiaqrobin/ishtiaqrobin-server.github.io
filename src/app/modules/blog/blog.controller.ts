import { NextFunction, Request, Response } from "express";
import { BlogService } from "./blog.service";
import { BlogStatusValue } from "./blog.interface";

// ── Helpers ───────────────────────────────────────────────

const parseBool = (v: unknown): boolean | undefined => {
  if (v === "true") return true;
  if (v === "false") return false;
  return undefined;
};

const parseNum = (v: unknown): number | undefined => {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
};

/** Merge uploaded files into the request body (multipart). */
const parseBlogPayload = (req: Request) => {
  const payload: any = { ...req.body };
  const files = req.files as Record<string, Express.Multer.File[]> | undefined;

  if (files?.thumbnail?.[0]) payload.thumbnail = files.thumbnail[0].path;
  if (files?.ogImage?.[0]) payload.ogImage = files.ogImage[0].path;

  // JSON-encoded arrays coming from FormData
  for (const key of ["tagIds", "tagNames"]) {
    if (typeof payload[key] === "string") {
      try {
        payload[key] = JSON.parse(payload[key]);
      } catch {
        payload[key] = payload[key]
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean);
      }
    }
  }

  return payload;
};

// ── Blog ──────────────────────────────────────────────────

const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BlogService.createBlog(parseBlogPayload(req));
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, isFeatured, isPinned, tagId, tagSlug, search, page, limit } =
      req.query;

    // Public callers only ever see PUBLISHED posts.
    // Admins (authenticated) may request any status.
    const isAdmin = Boolean(req.user);

    const result = await BlogService.getBlogs({
      status: status as BlogStatusValue | undefined,
      isFeatured: parseBool(isFeatured),
      isPinned: parseBool(isPinned),
      tagId: tagId as string | undefined,
      tagSlug: tagSlug as string | undefined,
      search: search as string | undefined,
      page: parseNum(page),
      limit: parseNum(limit),
      publicOnly: !isAdmin,
    });

    res.status(200).json({
      success: true,
      message: "Retrieved blogs successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BlogService.getBlogById(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Retrieved blog successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getBlogBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isAdmin = Boolean(req.user);
    const result = await BlogService.getBlogBySlug(
      req.params.slug as string,
      isAdmin,
    );
    res.status(200).json({
      success: true,
      message: "Retrieved blog successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BlogService.updateBlog(
      req.params.id as string,
      parseBlogPayload(req),
    );
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await BlogService.deleteBlog(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

const likeBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress || "unknown";
    const result = await BlogService.likeBlog(
      req.params.id as string,
      ipAddress,
    );
    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getRelatedBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = parseNum(req.query.limit) ?? 3;
    const result = await BlogService.getRelatedBlogs(
      req.params.slug as string,
      limit,
    );
    res.status(200).json({
      success: true,
      message: "Retrieved related blogs successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ── Tags ──────────────────────────────────────────────────

const getTags = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BlogService.getTags();
    res.status(200).json({
      success: true,
      message: "Retrieved tags successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const createTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BlogService.createTag(req.body);
    res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await BlogService.deleteTag(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// ── Comments ──────────────────────────────────────────────

const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BlogService.getComments(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Retrieved comments successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { isApproved, page, limit } = req.query;
    const result = await BlogService.getAllComments({
      isApproved: parseBool(isApproved),
      page: parseNum(page),
      limit: parseNum(limit),
    });
    res.status(200).json({
      success: true,
      message: "Retrieved comments successfully",
      data: result.data,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
};

const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress || "unknown";
    const result = await BlogService.createComment(
      req.params.id as string,
      req.body,
      ipAddress,
    );
    res.status(201).json({
      success: true,
      message: "Comment submitted — it will appear after approval.",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const approveComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const isApproved = parseBool(req.body?.isApproved) ?? true;
    const result = await BlogService.approveComment(
      req.params.id as string,
      isApproved,
    );
    res.status(200).json({
      success: true,
      message: isApproved ? "Comment approved" : "Comment unapproved",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await BlogService.deleteComment(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const BlogController = {
  createBlog,
  getBlogs,
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  likeBlog,
  getRelatedBlogs,
  getTags,
  createTag,
  deleteTag,
  getComments,
  getAllComments,
  createComment,
  approveComment,
  deleteComment,
};
