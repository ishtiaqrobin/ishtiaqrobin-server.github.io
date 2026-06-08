export type CreateVideoInput = {
  title?: string;
  description?: string;
  videoUrl: string;

  isPublished: boolean;
  sortOrder: number;
};

export type UpdateVideoInput = Partial<CreateVideoInput>;
