import { Request, Response } from "express";
import { StatsService } from "./stats.service";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// Get public statistics (Public)
const getPublicStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsService.getPublicStats();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Public statistics retrieved successfully",
    data: result,
  });
});

// Update or create public stats (Admin only)
const updatePublicStats = catchAsync(async (req: Request, res: Response) => {
  const result = await StatsService.updatePublicStats(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Public stats updated successfully",
    data: result,
  });
});

export const StatsController = {
  updatePublicStats,
  getPublicStats,
};
