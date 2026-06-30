export interface CreateReviewInput {
  position: string;
  companyName: string;
  comment: string;
}

export interface UpdateReviewInput {
  position?: string;
  companyName?: string;
  comment?: string;
}

// Admin-only fields
export interface AdminUpdateReviewInput extends UpdateReviewInput {
  isApproved?: boolean;
  isPinned?: boolean;
}
