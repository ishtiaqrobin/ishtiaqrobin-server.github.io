import express, { Router } from "express";
import { TimelineController } from "./timeline.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { TimelineValidation } from "./timeline.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// Get all timeline entries (public)
router.get("/", TimelineController.getTimelines);

// Get single timeline entry (public)
router.get("/:timelineId", TimelineController.getTimeline);

// Create timeline entry
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(TimelineValidation.createTimelineZodSchema),
  TimelineController.createTimeline,
);

// Update timeline entry
router.put(
  "/:timelineId",
  auth(UserRole.ADMIN),
  validateRequest(TimelineValidation.updateTimelineZodSchema),
  TimelineController.updateTimeline,
);

// Delete timeline entry
router.delete(
  "/:timelineId",
  auth(UserRole.ADMIN),
  TimelineController.deleteTimeline,
);

export const TimelineRouter: Router = router;
