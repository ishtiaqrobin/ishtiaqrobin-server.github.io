import { NextFunction, Request, Response } from "express";
import { VideoService } from "./video.service";

// Create video
const createVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await VideoService.createVideo(req.body);
    res.status(201).json({
      success: true,
      message: "Video created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all videos
const getVideos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isPublished } = req.query;
    const publishedFilter =
      isPublished === "true"
        ? true
        : isPublished === "false"
          ? false
          : undefined;

    const result = await VideoService.getVideos(publishedFilter);
    res.status(200).json({
      success: true,
      message: "Retrieved all videos successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update video
const updateVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await VideoService.updateVideo(id as string, req.body);
    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete video
const deleteVideo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await VideoService.deleteVideo(id as string);
    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const VideoController = {
  createVideo,
  getVideos,
  updateVideo,
  deleteVideo,
};
