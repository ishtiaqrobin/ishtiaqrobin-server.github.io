export type CreateAwardInput = {
  title: string;
  subTitle: string;
  date: string;
  details: string[];
  isPublished: boolean;
  sortOrder: number;
};

export type UpdateAwardInput = Partial<CreateAwardInput>;
