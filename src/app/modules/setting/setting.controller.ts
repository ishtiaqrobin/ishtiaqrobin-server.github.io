import { Request, Response } from "express";
import { SettingService } from "./setting.service";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

// Get settings (Public)
const getSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingService.getSettings();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Settings retrieved successfully",
    data: result,
  });
});

// Update settings (Admin only)
const updateSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingService.updateSettings(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Settings updated successfully",
    data: result,
  });
});

export const SettingController = {
  getSettings,
  updateSettings,
};
