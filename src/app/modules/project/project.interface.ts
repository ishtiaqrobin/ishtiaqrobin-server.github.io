export type ProjectSection = {
  id: string;
  label: string;
  content: string;
};

export type CreateProjectInput = {
  slug: string;
  title: string;
  description: string;
  thumbnail?: string;
  bannerImage?: string;
  year?: string;
  bgColor?: string;
  liveUrl?: string;
  githubUrl?: string;
  roles?: string;
  client?: string;
  techStack: string[];
  tags: string[];
  sections?: ProjectSection[];
  isFeatured?: boolean;
  isPublished?: boolean;
  sortOrder?: number;
  categoryId: string;
};

export type UpdateProjectInput = Partial<CreateProjectInput>;
