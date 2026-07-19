export type CreateFaqInput = {
  question: string;
  answer: string;
  isPublished: boolean;
  sortOrder: number;
};

export type UpdateFaqInput = Partial<CreateFaqInput>;
