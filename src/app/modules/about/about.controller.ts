import { NextFunction, Request, Response } from "express";
import { AboutService } from "./about.service";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

// Create about (upsert)
const createAbout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    const files = req.files as Record<string, Express.Multer.File[]>;

    if (files?.aboutMeImg?.[0]) payload.aboutMeImg = files.aboutMeImg[0].path;

    const result = await AboutService.createAbout(payload);
    res.status(201).json({
      success: true,
      message: "About created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get about (singleton)
const getAbout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AboutService.getAbout();
    if (!result) {
      throw new AppError(status.NOT_FOUND, "About not found");
    }
    res.status(200).json({
      success: true,
      message: "Retrieved about successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update about
const updateAbout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = { ...req.body };
    const files = req.files as Record<string, Express.Multer.File[]>;

    if (files?.aboutMeImg?.[0]) payload.aboutMeImg = files.aboutMeImg[0].path;

    const result = await AboutService.updateAbout(payload);
    res.status(200).json({
      success: true,
      message: "About updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const AboutController = {
  createAbout,
  getAbout,
  updateAbout,
};
