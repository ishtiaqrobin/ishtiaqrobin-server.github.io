export type CreateExperienceInput = {
  company: string;
  title: string;
  startDate: string;
  endDate?: string | null;
  location?: string | null;
  description?: string | null;
  // companyUrl?: string | null;
  // companyLogo?: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export type UpdateExperienceInput = Partial<CreateExperienceInput>;
