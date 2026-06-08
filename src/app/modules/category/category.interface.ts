export interface CreateCategoryInput {
  name: string;
  isPublished?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  isPublished?: boolean;
}
