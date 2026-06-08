import { NextFunction, Request, Response } from "express";
import { TimelineService } from "./timeline.service";

// Create timeline entry
const createTimeline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TimelineService.createTimeline(req.body);

    res.status(201).json({
      success: true,
      message: "Timeline entry created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all timeline entries
const getTimelines = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TimelineService.getTimelines();

    res.status(200).json({
      success: true,
      message: "Retrieved all timeline entries successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get single timeline entry
const getTimeline = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { timelineId } = req.params;
    const result = await TimelineService.getTimeline(timelineId as string);

    res.status(200).json({
      success: true,
      message: "Retrieved timeline entry successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update timeline entry
const updateTimeline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { timelineId } = req.params;
    const result = await TimelineService.updateTimeline(
      timelineId as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Timeline entry updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete timeline entry
const deleteTimeline = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { timelineId } = req.params;
    const result = await TimelineService.deleteTimeline(timelineId as string);

    res.status(200).json({
      success: true,
      message: "Timeline entry deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const TimelineController = {
  createTimeline,
  getTimelines,
  getTimeline,
  updateTimeline,
  deleteTimeline,
};
