import { NextFunction, Request, Response } from "express";
import { ExperienceService } from "./experience.service";

const parseExperiencePayload = (req: Request) => {
  const payload: any = { ...req.body };
  const files = req.files as Record<string, Express.Multer.File[]> | undefined;

  if (files?.companyLogo?.[0]) {
    payload.companyLogo = files.companyLogo[0].path;
  }

  if (payload.responsibilities && typeof payload.responsibilities === "string") {
    try {
      payload.responsibilities = JSON.parse(payload.responsibilities);
    } catch {
      payload.responsibilities = payload.responsibilities
        .split("\n")
        .map((r: string) => r.trim())
        .filter(Boolean);
    }
  }

  return payload;
};

const createExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ExperienceService.createExperience(
      parseExperiencePayload(req),
    );
    res.status(201).json({
      success: true,
      message: "Experience created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

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

const updateExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await ExperienceService.updateExperience(
      id as string,
      parseExperiencePayload(req),
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

const deleteExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await ExperienceService.deleteExperience(id as string);
    res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
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
