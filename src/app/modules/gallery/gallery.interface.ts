export type CreateGalleryInput = {
  image?: string;
  title?: string;
  description?: string;
  isPublish?: boolean;
  sortOrder?: number;
};

export type UpdateGalleryInput = Partial<CreateGalleryInput>;
