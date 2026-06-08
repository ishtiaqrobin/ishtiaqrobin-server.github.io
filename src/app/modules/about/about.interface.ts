export interface CreateAboutInput {
  title?: string;
  subtitle?: string;
  description?: string;
  heroImg?: string;
  aboutMeImg?: string;
  resumeUrl?: string;
  resumeDownloadCount?: number;
}

export type UpdateAboutInput = Partial<CreateAboutInput>;
