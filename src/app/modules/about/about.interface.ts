export interface CreateAboutInput {
  title?: string;
  subtitle?: string;
  description?: string;
  aboutMeImg?: string;
  resumeUrl?: string;
}

export type UpdateAboutInput = Partial<CreateAboutInput>;
