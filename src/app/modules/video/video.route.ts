import express, { Router } from "express";
import { VideoController } from "./video.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { VideoValidation } from "./video.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// Get all videos
router.get("/", VideoController.getVideos);

// Create video
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(VideoValidation.createVideoZodSchema),
  VideoController.createVideo,
);

// Update video
router.put(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(VideoValidation.updateVideoZodSchema),
  VideoController.updateVideo,
);

// Delete video
router.delete("/:id", auth(UserRole.ADMIN), VideoController.deleteVideo);

export const VideoRouter: Router = router;
