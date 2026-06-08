import httpStatus from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import {
  CreateContributionInput,
  UpdateContributionInput,
} from "./github.interface";

const GITHUB_API_BASE = "https://api.github.com";

// ─── GitHub Stats Cache (Singleton) ───────────────────────────

// Get cached GitHub stats (public)
const getGithubStats = async () => {
  const result = await prisma.gitHubStatsCache.findUnique({
    where: { id: "singleton" },
  });

  return result;
};

// Sync GitHub stats from the GitHub API and update the singleton cache (admin)
const syncGithubStats = async (username: string) => {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  };

  // Fetch user profile
  const userRes = await fetch(`${GITHUB_API_BASE}/users/${username}`, {
    headers,
  });

  if (!userRes.ok) {
    throw new AppError(
      httpStatus.BAD_GATEWAY,
      `Failed to fetch GitHub profile for "${username}"`,
    );
  }

  const user = await userRes.json();

  // Fetch all repos to calculate total stars and forks
  const reposRes = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?per_page=100&type=owner`,
    { headers },
  );

  const repos: any[] = reposRes.ok ? await reposRes.json() : [];

  const totalStars = repos.reduce(
    (sum, r) => sum + (r.stargazers_count ?? 0),
    0,
  );
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count ?? 0), 0);

  // Fetch top languages
  const languageCounts: Record<string, number> = {};
  await Promise.allSettled(
    repos.map(async (repo) => {
      const langRes = await fetch(repo.languages_url, { headers });
      if (!langRes.ok) return;
      const langs: Record<string, number> = await langRes.json();
      for (const [lang, bytes] of Object.entries(langs)) {
        languageCounts[lang] = (languageCounts[lang] ?? 0) + bytes;
      }
    }),
  );

  const totalBytes = Object.values(languageCounts).reduce((a, b) => a + b, 0);
  const topLanguages = Object.entries(languageCounts)
    .map(([name, bytes]) => ({
      name,
      percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 10);

  const result = await prisma.gitHubStatsCache.upsert({
    where: { id: "singleton" },
    update: {
      username,
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      totalStars,
      totalForks,
      topLanguages,
      lastSyncedAt: new Date(),
    },
    create: {
      id: "singleton",
      username,
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      totalStars,
      totalForks,
      topLanguages,
      lastSyncedAt: new Date(),
    },
  });

  return result;
};

// ─── Open Source Contributions (CRUD) ─────────────────────────

// Create a contribution (admin)
const createContribution = async (payload: CreateContributionInput) => {
  const { mergedAt, ...rest } = payload;

  const result = await prisma.openSourceContribution.create({
    data: {
      ...rest,
      ...(mergedAt ? { mergedAt: new Date(mergedAt) } : {}),
    },
  });

  return result;
};

// Get all published contributions (public)
const getAllContributions = async () => {
  const result = await prisma.openSourceContribution.findMany({
    where: { isPublished: true },
    orderBy: [
      { sortOrder: "asc" },
      { mergedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return result;
};

// Get all contributions including unpublished (admin)
const getAllContributionsAdmin = async () => {
  const result = await prisma.openSourceContribution.findMany({
    orderBy: [
      { sortOrder: "asc" },
      { mergedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return result;
};

// Get a single contribution by ID (admin)
const getContributionById = async (id: string) => {
  const result = await prisma.openSourceContribution.findUnique({
    where: { id },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Contribution not found");
  }

  return result;
};

// Update a contribution (admin)
const updateContribution = async (
  id: string,
  payload: UpdateContributionInput,
) => {
  await getContributionById(id); // ensure it exists

  const { mergedAt, ...rest } = payload;

  const result = await prisma.openSourceContribution.update({
    where: { id },
    data: {
      ...rest,
      ...(mergedAt ? { mergedAt: new Date(mergedAt) } : {}),
    },
  });

  return result;
};

// Delete a contribution (admin)
const deleteContribution = async (id: string) => {
  await getContributionById(id); // ensure it exists

  await prisma.openSourceContribution.delete({ where: { id } });
};

export const GithubService = {
  getGithubStats,
  syncGithubStats,
  createContribution,
  getAllContributions,
  getAllContributionsAdmin,
  getContributionById,
  updateContribution,
  deleteContribution,
};
