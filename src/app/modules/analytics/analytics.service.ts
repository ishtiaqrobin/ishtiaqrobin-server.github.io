import { prisma } from "../../lib/prisma";
import {
  AnalyticsQueryInput,
  CreatePageViewInput,
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

// Get all resume download logs
const getResumeDownloadLogs = async () => {
  const result = await prisma.resumeDownloadLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const AnalyticsService = {
  trackPageView,
  getPageViews,
  getPageViewStats,
  getResumeDownloadLogs,
};
