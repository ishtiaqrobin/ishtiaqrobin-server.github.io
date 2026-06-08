import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";

// Get all users (Admin only)
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.query;

    const result = await AdminService.getAllUsers(role as string);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Ban user (Admin only)
const banUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await AdminService.banUser(userId as string);

    res.status(200).json({
      success: true,
      message: "User banned successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Unban user (Admin only)
const unbanUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await AdminService.unbanUser(userId as string);

    res.status(200).json({
      success: true,
      message: "User unbanned successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get dashboard statistics (Admin only)
const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AdminService.getDashboardStats();

    res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const AdminController = {
  getAllUsers,
  banUser,
  unbanUser,
  getDashboardStats,
};
