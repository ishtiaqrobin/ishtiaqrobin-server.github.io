import { prisma } from "../../lib/prisma";
import {
  AdminUpdateReviewInput,
  CreateReviewInput,
  UpdateReviewInput,
} from "./review.interface";

// Create review (user only — one per user)
const createReview = async (userId: string, payload: CreateReviewInput) => {
  const existingReview = await prisma.review.findUnique({
    where: { userId },
  });

  if (existingReview) {
    throw new Error("You have already submitted a review.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const review = await tx.review.create({
      data: {
        userId,
        ...payload,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: {
        isReviewed: true,
        reviewId: review.id,
      },
    });

    return review;
  });

  return result;
};

// Update review (user updates own; admin updates any + can set isApproved/isPinned)
const updateReview = async (
  id: string,
  user: { id: string; role: string },
  payload: UpdateReviewInput | AdminUpdateReviewInput,
) => {
  const existingReview = await prisma.review.findUnique({
    where: { id },
  });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  if (user.role !== "ADMIN" && existingReview.userId !== user.id) {
    throw new Error("You do not have permission to update this review");
  }

  // Strip isApproved / isPinned if the caller is not an admin
  const data: AdminUpdateReviewInput =
    user.role === "ADMIN"
      ? (payload as AdminUpdateReviewInput)
      : {
          ...(payload.rating !== undefined ? { rating: payload.rating } : {}),
          ...(payload.comment !== undefined
            ? { comment: payload.comment }
            : {}),
        };

  const result = await prisma.review.update({
    where: { id },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return result;
};

// Delete review (user deletes own; admin deletes any)
const deleteReview = async (id: string, user: { id: string; role: string }) => {
  const existingReview = await prisma.review.findUnique({
    where: { id },
  });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  if (user.role !== "ADMIN" && existingReview.userId !== user.id) {
    throw new Error("You do not have permission to delete this review");
  }

  const result = await prisma.$transaction(async (tx) => {
    const deletedReview = await tx.review.delete({
      where: { id },
    });

    await tx.user.update({
      where: { id: existingReview.userId },
      data: {
        isReviewed: false,
        reviewId: null,
      },
    });

    return deletedReview;
  });

  return result;
};

// Get approved reviews (public) — pinned first, then newest
const getAllReviews = async (limit: number = 10) => {
  const result = await prisma.review.findMany({
    where: { isApproved: true },
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return result;
};

// Get all reviews including unapproved (admin)
const getAllReviewsAdmin = async () => {
  const result = await prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });

  return result;
};

// Approve a review (admin)
const approveReview = async (id: string) => {
  const existingReview = await prisma.review.findUnique({ where: { id } });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  const result = await prisma.review.update({
    where: { id },
    data: { isApproved: !existingReview.isApproved },
  });

  return result;
};

// Pin / unpin a review (admin)
const pinReview = async (id: string) => {
  const existingReview = await prisma.review.findUnique({ where: { id } });

  if (!existingReview) {
    throw new Error("Review not found");
  }

  const result = await prisma.review.update({
    where: { id },
    data: { isPinned: !existingReview.isPinned },
  });

  return result;
};

// Get my reviews (user)
const getMyReviews = async (userId: string) => {
  const result = await prisma.review.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return result;
};

export const ReviewService = {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getAllReviewsAdmin,
  approveReview,
  pinReview,
  getMyReviews,
};
