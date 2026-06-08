import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { ReviewController } from "./review.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { ReviewValidation } from "./review.validation";

const router = express.Router();

// Get all approved reviews (Public)
router.get("/", ReviewController.getAllReviews);

// Create review (User only)
router.post(
  "/",
  auth(UserRole.USER),
  validateRequest(ReviewValidation.createReviewZodSchema),
  ReviewController.createReview,
);

// Get my reviews (User only)
router.get("/me", auth(UserRole.USER), ReviewController.getMyReviews);

// Update review (User updates own; Admin updates any + can set isApproved/isPinned)
router.put(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(ReviewValidation.adminUpdateReviewZodSchema),
  ReviewController.updateReview,
);

// Delete review (User deletes own; Admin deletes any)
router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  ReviewController.deleteReview,
);

// Get all reviews including unapproved (Admin only)
router.get("/admin", auth(UserRole.ADMIN), ReviewController.getAllReviewsAdmin);

// Toggle approve/unapproved a review (Admin only)
router.patch(
  "/:id/approve",
  auth(UserRole.ADMIN),
  ReviewController.approveReview,
);

// Toggle pin/unpin a review (Admin only)
router.patch("/:id/pin", auth(UserRole.ADMIN), ReviewController.pinReview);

export const ReviewRouter: Router = router;
