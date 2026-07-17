import { NextFunction, Request, Response } from "express";
import { ExperienceService } from "./experience.service";

// Create experience
const createExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ExperienceService.createExperience(req.body);
    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all experiences
const getExperiences = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { isPublished } = req.query;
    const publishedFilter =
      isPublished === "true"
        ? true
        : isPublished === "false"
          ? false
          : undefined;

    const result = await ExperienceService.getExperiences(publishedFilter);
    res.status(200).json({
      success: true,
      message: "Retrieved all experiences successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update experience
const updateExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await ExperienceService.updateExperience(
      id as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete experience
const deleteExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await ExperienceService.deleteExperience(id as string);
    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const ExperienceController = {
  createExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
};
