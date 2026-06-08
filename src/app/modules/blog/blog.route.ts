import express, { Router } from "express";
import { BlogController } from "./blog.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { BlogValidation } from "./blog.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { createMulterUpload } from "../../config/multer.config";

const blogImageUpload = createMulterUpload("blogs");

const router = express.Router();

// ── Blog ──────────────────────────────────────────────────

// Get all blogs
router.get("/", BlogController.getBlogs);

// Get blog by slug (public — must be before /:id)
router.get("/slug/:slug", BlogController.getBlogBySlug);

// Get single blog by id
router.get("/:id", BlogController.getBlogById);

// Create blog
router.post(
  "/",
  auth(UserRole.ADMIN),
  blogImageUpload.single("thumbnail"),
  validateRequest(BlogValidation.createBlogZodSchema),
  BlogController.createBlog,
);

// Update blog
router.put(
  "/:id",
  auth(UserRole.ADMIN),
  blogImageUpload.single("thumbnail"),
  validateRequest(BlogValidation.updateBlogZodSchema),
  BlogController.updateBlog,
);

// Like blog (public)
router.patch("/:id/like", BlogController.likeBlog);

// Delete blog
router.delete("/:id", auth(UserRole.ADMIN), BlogController.deleteBlog);

// ── Blog Tag ──────────────────────────────────────────────

// Get all tags
router.get("/tags/all", BlogController.getBlogTags);

// Create tag
router.post(
  "/tags",
  auth(UserRole.ADMIN),
  validateRequest(BlogValidation.createBlogTagZodSchema),
  BlogController.createBlogTag,
);

// Update tag
router.put(
  "/tags/:id",
  auth(UserRole.ADMIN),
  validateRequest(BlogValidation.updateBlogTagZodSchema),
  BlogController.updateBlogTag,
);

// Delete tag
router.delete("/tags/:id", auth(UserRole.ADMIN), BlogController.deleteBlogTag);

// ── Blog Comment ──────────────────────────────────────────

// Create comment (public)
router.post(
  "/comments",
  validateRequest(BlogValidation.createBlogCommentZodSchema),
  BlogController.createComment,
);

// Get all comments (admin)
router.get("/comments/all", auth(UserRole.ADMIN), BlogController.getComments);

// Approve comment (admin)
router.patch(
  "/comments/:id/approve",
  auth(UserRole.ADMIN),
  BlogController.approveComment,
);

// Delete comment (admin)
router.delete(
  "/comments/:id",
  auth(UserRole.ADMIN),
  BlogController.deleteComment,
);

export const BlogRouter: Router = router;
