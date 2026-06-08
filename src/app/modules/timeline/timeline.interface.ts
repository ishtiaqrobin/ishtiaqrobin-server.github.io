export interface CreateTimelineInput {
  title: string;
  description?: string;
  date: Date | string;
  icon?: string;
  color?: string;
  url?: string;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateTimelineInput {
  title?: string;
  description?: string;
  date?: Date | string;
  icon?: string;
  color?: string;
  url?: string;
  isPublished?: boolean;
  sortOrder?: number;
}
