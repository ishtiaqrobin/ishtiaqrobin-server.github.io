// ── Blog ──────────────────────────────────────────────────

export type BlogStatusValue = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface CreateBlogInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  thumbnail?: string;
  coverImageAlt?: string;
  status?: BlogStatusValue;
  isFeatured?: boolean;
  isPinned?: boolean;
  publishedAt?: string | Date | null;

  authorName?: string;
  readingTime?: number;

  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;

  // Tags — accept ids or names (names auto-create)
  tagIds?: string[];
  tagNames?: string[];
}

export type UpdateBlogInput = Partial<CreateBlogInput>;

export interface BlogFilters {
  status?: BlogStatusValue | undefined;
  isFeatured?: boolean | undefined;
  isPinned?: boolean | undefined;
  tagId?: string | undefined;
  tagSlug?: string | undefined;
  search?: string | undefined;
  page?: number | undefined;
  limit?: number | undefined;
  /** When true, only PUBLISHED posts are returned (public access). */
  publicOnly?: boolean | undefined;
}

// ── Blog Tag ──────────────────────────────────────────────

export interface CreateBlogTagInput {
  name: string;
  slug?: string;
}

// ── Blog Comment ──────────────────────────────────────────

export interface CreateBlogCommentInput {
  name: string;
  email: string;
  comment: string;
  parentId?: string;
}

export interface BlogCommentFilters {
  isApproved?: boolean | undefined;
  page?: number | undefined;
  limit?: number | undefined;
}
