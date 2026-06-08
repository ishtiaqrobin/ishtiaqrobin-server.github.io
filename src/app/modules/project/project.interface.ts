export type CreateProjectInput = {
  title: string;
  description: string;
  thumbnail?: string;
  liveUrl?: string;
  githubUrl?: string;
  tags: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
  categoryId: string;
  projectImages?: Array<{
    url: string;
    alt?: string;
    sortOrder?: number;
  }>;
};

export type UpdateProjectInput = Partial<CreateProjectInput>;

export type ProjectImageInput = {
  url: string;
  alt?: string;
  sortOrder?: number;
};
