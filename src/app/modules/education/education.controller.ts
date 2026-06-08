import { NextFunction, Request, Response } from "express";
import { EducationService } from "./education.service";

// Create education
const createEducation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await EducationService.createEducation(req.body);
    res.status(201).json({
      success: true,
      message: "Education created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all educations
const getEducations = async (
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

    const result = await EducationService.getEducations(publishedFilter);
    res.status(200).json({
      success: true,
      message: "Retrieved all educations successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update education
const updateEducation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await EducationService.updateEducation(
      id as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Education updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete education
const deleteEducation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await EducationService.deleteEducation(id as string);
    res.status(200).json({
      success: true,
      message: "Education deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const EducationController = {
  createEducation,
  getEducations,
  updateEducation,
  deleteEducation,
};
