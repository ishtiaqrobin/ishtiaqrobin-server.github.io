import { NextFunction, Request, Response } from "express";
import { ReviewService } from "./review.service";

// Create review (user only)
const createReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await ReviewService.createReview(userId, req.body);

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update review (user updates own; admin updates any)
const updateReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await ReviewService.updateReview(
      id as string,
      user as any,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete review (user deletes own; admin deletes any)
const deleteReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await ReviewService.deleteReview(id as string, user as any);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all approved reviews (public)
const getAllReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const result = await ReviewService.getAllReviews(limit);

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all reviews including unapproved (admin)
const getAllReviewsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ReviewService.getAllReviewsAdmin();

    res.status(200).json({
      success: true,
      message: "All reviews retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Toggle approve a review (admin)
const approveReview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await ReviewService.approveReview(id as string);

    res.status(200).json({
      success: true,
      message: `Review ${result.isApproved ? "approved" : "unapproved"} successfully`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Toggle pin a review (admin)
const pinReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await ReviewService.pinReview(id as string);

    res.status(200).json({
      success: true,
      message: `Review ${result.isPinned ? "pinned" : "unpinned"} successfully`,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get my reviews (user only)
const getMyReviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await ReviewService.getMyReviews(userId);

    res.status(200).json({
      success: true,
      message: "My reviews retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const ReviewController = {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getAllReviewsAdmin,
  approveReview,
  pinReview,
  getMyReviews,
};
