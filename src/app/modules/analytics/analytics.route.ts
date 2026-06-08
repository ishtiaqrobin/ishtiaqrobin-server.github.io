import express, { Router } from "express";
import { AnalyticsController } from "./analytics.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { AnalyticsValidation } from "./analytics.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// ─── Page Views ────────────────────────────────────────────────

// Track a page view (public — called from the frontend on every page load)
router.post(
  "/page-views",
  validateRequest(AnalyticsValidation.createPageViewZodSchema),
  AnalyticsController.trackPageView,
);

// Get all page views (admin only)
router.get(
  "/page-views",
  auth(UserRole.ADMIN),
  AnalyticsController.getPageViews,
);

// Get page view stats grouped by page (admin only)
router.get(
  "/page-views/stats",
  auth(UserRole.ADMIN),
  AnalyticsController.getPageViewStats,
);

// ─── Resume Downloads ──────────────────────────────────────────

// Track a resume download (public — called when visitor downloads resume)
router.post(
  "/resume-downloads",
  validateRequest(AnalyticsValidation.createResumeDownloadLogZodSchema),
  AnalyticsController.trackResumeDownload,
);

// Get all resume download logs (admin only)
router.get(
  "/resume-downloads",
  auth(UserRole.ADMIN),
  AnalyticsController.getResumeDownloadLogs,
);

// Get resume download count (admin only)
router.get(
  "/resume-downloads/count",
  auth(UserRole.ADMIN),
  AnalyticsController.getResumeDownloadCount,
);

export const AnalyticsRouter: Router = router;