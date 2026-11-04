import express, { Router } from "express";
import { BlogController } from "./blog.controller";
import auth, { optionalAuth, UserRole } from "../../middlewares/auth";
import { BlogValidation } from "./blog.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { createMulterUpload } from "../../config/multer.config";

const blogUpload = createMulterUpload("blogs");

const router = express.Router();

// ── Tags (public read, admin write) ───────────────────────
// NOTE: must be declared before "/:id" so "tags" isn't captured as an id.

router.get("/tags", BlogController.getTags);

router.post(
  "/tags",
  auth(UserRole.ADMIN),
  validateRequest(BlogValidation.createBlogTagZodSchema),
  BlogController.createTag,
);

router.delete("/tags/:id", auth(UserRole.ADMIN), BlogController.deleteTag);

// ── Comments (admin moderation) ───────────────────────────
// Declared before "/:id" for the same reason.

router.get("/comments", auth(UserRole.ADMIN), BlogController.getAllComments);

router.patch(
  "/comments/:id/approve",
  auth(UserRole.ADMIN),
  BlogController.approveComment,
);

router.delete(
  "/comments/:id",
  auth(UserRole.ADMIN),
  BlogController.deleteComment,
);

// ── Blog list & create ────────────────────────────────────

// Public list — admins (with a session) additionally see drafts
router.get("/", optionalAuth, BlogController.getBlogs);

router.post(
  "/",
  auth(UserRole.ADMIN),
  blogUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "ogImage", maxCount: 1 },
  ]),
  validateRequest(BlogValidation.createBlogZodSchema),
  BlogController.createBlog,
);

// ── Single blog ───────────────────────────────────────────

router.get("/slug/:slug", optionalAuth, BlogController.getBlogBySlug);

router.get("/slug/:slug/related", BlogController.getRelatedBlogs);

router.get("/:id", BlogController.getBlogById);

router.put(
  "/:id",
  auth(UserRole.ADMIN),
  blogUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "ogImage", maxCount: 1 },
  ]),
  validateRequest(BlogValidation.updateBlogZodSchema),
  BlogController.updateBlog,
);

router.delete("/:id", auth(UserRole.ADMIN), BlogController.deleteBlog);

// ── Likes & comments on a specific blog ───────────────────

router.post("/:id/like", BlogController.likeBlog);

router.get("/:id/comments", BlogController.getComments);

router.post(
  "/:id/comments",
  validateRequest(BlogValidation.createBlogCommentZodSchema),
  BlogController.createComment,
);

export const BlogRouter: Router = router;
