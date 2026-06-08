export interface CreateNpmPackageInput {
  name: string;
  description?: string;
  npmUrl: string;
  githubUrl?: string;
  weeklyDownloads?: number;
  totalDownloads?: number;
  version?: string;
  isPublished?: boolean;
  sortOrder?: number;
}

export interface UpdateNpmPackageInput {
  name?: string;
  description?: string;
  npmUrl?: string;
  githubUrl?: string;
  weeklyDownloads?: number;
  totalDownloads?: number;
  version?: string;
  isPublished?: boolean;
  sortOrder?: number;
}
