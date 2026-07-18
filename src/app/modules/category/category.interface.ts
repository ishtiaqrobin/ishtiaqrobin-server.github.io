export interface CreateCategoryInput {
  name: string;
  sortOrder?: number;
  isPublished?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  sortOrder?: number;
  isPublished?: boolean;
}
