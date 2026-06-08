import { prisma } from "../../lib/prisma";
import {
  AnalyticsQueryInput,
  CreatePageViewInput,
  CreateResumeDownloadLogInput,
} from "./analytics.interface";

// Track a page view
const trackPageView = async (payload: CreatePageViewInput) => {
  const result = await prisma.pageView.create({
    data: payload,
  });

  return result;
};

// Get all page views (with optional filters)
const getPageViews = async (query: AnalyticsQueryInput) => {
  const { page, startDate, endDate } = query;

  const result = await prisma.pageView.findMany({
    where: {
      ...(page && { page }),
      ...(startDate || endDate
        ? {
            createdAt: {
              ...(startDate && { gte: new Date(startDate) }),
              ...(endDate && { lte: new Date(endDate) }),
            },
          }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// Get page view stats (grouped by page)
const getPageViewStats = async () => {
  const result = await prisma.pageView.groupBy({
    by: ["page"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });

  return result.map((item) => ({
    page: item.page,
    totalViews: item._count.id,
  }));
};

// Track a resume download
const trackResumeDownload = async (payload: CreateResumeDownloadLogInput) => {
  // Log the download
  const log = await prisma.resumeDownloadLog.create({
    data: payload,
  });

  // Increment the counter in About singleton
  await prisma.about.upsert({
    where: { id: "singleton" },
    update: {
      resumeDownloadCount: {
        increment: 1,
      },
    },
    create: {
      id: "singleton",
      resumeDownloadCount: 1,
    },
  });

  return log;
};

// Get all resume download logs
const getResumeDownloadLogs = async () => {
  const result = await prisma.resumeDownloadLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// Get resume download count from About singleton
const getResumeDownloadCount = async () => {
  const about = await prisma.about.findUnique({
    where: { id: "singleton" },
    select: { resumeDownloadCount: true },
  });

  return { resumeDownloadCount: about?.resumeDownloadCount ?? 0 };
};

export const AnalyticsService = {
  trackPageView,
  getPageViews,
  getPageViewStats,
  trackResumeDownload,
  getResumeDownloadLogs,
  getResumeDownloadCount,
};
