export interface CreateReviewInput {
  rating: number;
  comment: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

// Admin-only fields
export interface AdminUpdateReviewInput extends UpdateReviewInput {
  isApproved?: boolean;
  isPinned?: boolean;
}
