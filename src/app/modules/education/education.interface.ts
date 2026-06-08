export type CreateEducationInput = {
  degree: string;
  institution: string;
  board?: string | null;
  startDate: string;
  endDate?: string | null;
  result: string;
  group?: string | null;
  // description?: string | null;

  isPublished: boolean;
  sortOrder: number;
};

export type UpdateEducationInput = Partial<CreateEducationInput>;
