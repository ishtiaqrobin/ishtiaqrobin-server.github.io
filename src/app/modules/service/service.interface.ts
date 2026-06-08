export type CreateServiceInput = {
  name: string;
  icon?: {
    name: string;
    library: string;
    color: string;
    bgColor: string;
  };
  description?: string;
  isPublished?: boolean;
  sortOrder?: number;
};

export type UpdateServiceInput = Partial<CreateServiceInput>;
