export interface CreateContributionInput {
  repoName: string;
  repoUrl: string;
  description?: string;
  prUrl?: string;
  issueUrl?: string;
  mergedAt?: string; // ISO date string from request
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateContributionInput {
  repoName?: string;
  repoUrl?: string;
  description?: string;
  prUrl?: string;
  issueUrl?: string;
  mergedAt?: string;
  isPublished?: boolean;
  sortOrder?: number;
}
