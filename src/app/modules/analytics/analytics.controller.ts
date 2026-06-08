import { NextFunction, Request, Response } from "express";
import { AnalyticsService } from "./analytics.service";

// Track a page view
const trackPageView = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AnalyticsService.trackPageView(req.body);

    res.status(201).json({
      success: true,
      message: "Page view tracked successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all page views
const getPageViews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AnalyticsService.getPageViews(req.query as any);

    res.status(200).json({
      success: true,
      message: "Retrieved all page views successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get page view stats grouped by page
const getPageViewStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AnalyticsService.getPageViewStats();

    res.status(200).json({
      success: true,
      message: "Retrieved page view stats successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Track a resume download
const trackResumeDownload = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AnalyticsService.trackResumeDownload(req.body);

    res.status(201).json({
      success: true,
      message: "Resume download tracked successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all resume download logs
const getResumeDownloadLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AnalyticsService.getResumeDownloadLogs();

    res.status(200).json({
      success: true,
      message: "Retrieved resume download logs successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get resume download count
const getResumeDownloadCount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AnalyticsService.getResumeDownloadCount();

    res.status(200).json({
      success: true,
      message: "Retrieved resume download count successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const AnalyticsController = {
  trackPageView,
  getPageViews,
  getPageViewStats,
  trackResumeDownload,
  getResumeDownloadLogs,
  getResumeDownloadCount,
};
