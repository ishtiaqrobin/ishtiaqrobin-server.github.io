import express, { Router } from "express";
import { RssController } from "./rss.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { RssValidation } from "./rss.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// ─── Config routes ───

// Get RSS config (public)
router.get("/config", RssController.getConfig);

// Update RSS config
router.patch(
  "/config",
  auth(UserRole.ADMIN),
  validateRequest(RssValidation.updateConfigZodSchema),
  RssController.updateConfig,
);

// ─── Subscriber routes ───

// Subscribe (public)
router.post(
  "/subscribe",
  validateRequest(RssValidation.subscribeZodSchema),
  RssController.subscribe,
);

// Verify email (public — clicked from email link)
router.get("/verify/:token", RssController.verifySubscriber);

// Unsubscribe (public — clicked from email link)
router.get("/unsubscribe/:token", RssController.unsubscribe);

// Get all subscribers
router.get("/subscribers", auth(UserRole.ADMIN), RssController.getSubscribers);

// Delete subscriber
router.delete(
  "/subscribers/:subscriberId",
  auth(UserRole.ADMIN),
  RssController.deleteSubscriber,
);

export const RssRouter: Router = router;
