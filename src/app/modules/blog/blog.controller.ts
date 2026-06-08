import { NextFunction, Request, Response } from "express";
import { BlogService } from "./blog.service";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

// ── Blog ──────────────────────────────────────────────────

// Create blog
const createBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    if (req.file) payload.thumbnail = req.file.path;

    const result = await BlogService.createBlog(payload);
    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all blogs
const getBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status: blogStatus, isFeatured, tagId } = req.query;

    const isFeaturedFilter =
      isFeatured === "true" ? true : isFeatured === "false" ? false : undefined;

    // ✅ Fix: build the filters object conditionally, never set a key to undefined
    const filters: { status?: string; isFeatured?: boolean; tagId?: string } =
      {};

    if (blogStatus) filters.status = blogStatus as string;
    if (isFeaturedFilter !== undefined) filters.isFeatured = isFeaturedFilter;
    if (tagId) filters.tagId = tagId as string;

    const result = await BlogService.getBlogs(filters);
    res.status(200).json({
      success: true,
      message: "Retrieved blogs successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get single blog by id
const getBlogById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await BlogService.getBlogById(id as string);
    if (!result) throw new AppError(status.NOT_FOUND, "Blog not found");
    res.status(200).json({
      success: true,
      message: "Retrieved blog successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get blog by slug (public — increments viewCount)
const getBlogBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.slug;
    const result = await BlogService.getBlogBySlug(id as string);
    res.status(200).json({
      success: true,
      message: "Retrieved blog successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update blog
const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    const id = req.params.id;
    if (req.file) payload.thumbnail = req.file.path;

    const result = await BlogService.updateBlog(id as string, payload);
    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Like blog
const likeBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const result = await BlogService.likeBlog(id as string);
    res.status(200).json({
      success: true,
      message: "Blog liked",
      data: { likeCount: result.likeCount },
    });
  } catch (err) {
    next(err);
  }
};

// Delete blog
const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    await BlogService.deleteBlog(id as string);
    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// ── Blog Tag ──────────────────────────────────────────────

// Create tag
const createBlogTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await BlogService.createBlogTag(req.body);
    res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all tags
const getBlogTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BlogService.getBlogTags();
    res.status(200).json({
      success: true,
      message: "Retrieved tags successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update tag
const updateBlogTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await BlogService.updateBlogTag(id as string, req.body);
    res.status(200).json({
      success: true,
      message: "Tag updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete tag
const deleteBlogTag = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    await BlogService.deleteBlogTag(id as string);
    res.status(200).json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

// ── Blog Comment ──────────────────────────────────────────

// Create comment (public)
const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ipAddress = req.ip || req.socket.remoteAddress;
    const result = await BlogService.createComment(req.body, ipAddress);
    res.status(201).json({
      success: true,
      message: "Comment submitted, pending approval",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all comments (admin)
const getComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { blogId, isApproved } = req.query;
    const result = await BlogService.getComments(
      blogId as string,
      isApproved === "true" ? true : isApproved === "false" ? false : undefined,
    );
    res.status(200).json({
      success: true,
      message: "Retrieved comments successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Approve comment (admin)
const approveComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    const result = await BlogService.approveComment(id as string);
    res.status(200).json({
      success: true,
      message: "Comment approved",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete comment (admin)
const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id;
    await BlogService.deleteComment(id as string);
    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const BlogController = {
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
