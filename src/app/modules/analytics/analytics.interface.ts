export interface CreatePageViewInput {
  page: string;
  userAgent?: string;
  ipAddress?: string;
  country?: string;
  city?: string;
  referrer?: string;
}

export interface CreateResumeDownloadLogInput {
  ipAddress?: string;
  country?: string;
  userAgent?: string;
}

export interface AnalyticsQueryInput {
  page?: string;
  startDate?: string;
  endDate?: string;
}
