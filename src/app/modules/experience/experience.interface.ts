export type CreateExperienceInput = {
  position: string;
  companyName: string;
  companyUrl?: string | null;
  companyLogo?: string | null;
  responsibilities: string[];
  startDate: string;
  endDate?: string | null;
  isPublished: boolean;
  sortOrder: number;
};

export type UpdateExperienceInput = Partial<CreateExperienceInput>;
