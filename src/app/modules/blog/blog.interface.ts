export type CreateBlogInput = {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured?: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  tagIds?: string[]; // existing BlogTag ids to connect
};

export type UpdateBlogInput = Partial<CreateBlogInput>;

// Blog Tag
export type CreateBlogTagInput = {
  name: string;
  slug: string;
};

export type UpdateBlogTagInput = Partial<CreateBlogTagInput>;

// Blog Comment
export type CreateBlogCommentInput = {
  name: string;
  email: string;
  comment: string;
  blogId: string;
  parentId?: string;
  ipAddress?: string;
};
