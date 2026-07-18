import { NextFunction, Request, Response } from "express";
import { AwardService } from "./award.service";

const parseAwardPayload = (req: Request) => {
  const payload: any = { ...req.body };

  if (payload.details && typeof payload.details === "string") {
    try {
      payload.details = JSON.parse(payload.details);
    } catch {
      payload.details = payload.details
        .split("\n")
        .map((r: string) => r.trim())
        .filter(Boolean);
    }
  }

  return payload;
};

const createAward = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AwardService.createAward(
      parseAwardPayload(req),
    );
    res.status(201).json({
      success: true,
      message: "Award created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAwards = async (
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

    const result = await AwardService.getAwards(publishedFilter);
    res.status(200).json({
      success: true,
      message: "Retrieved all awards successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateAward = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await AwardService.updateAward(
      id as string,
      parseAwardPayload(req),
    );
    res.status(200).json({
      success: true,
      message: "Award updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteAward = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await AwardService.deleteAward(id as string);
    res.status(200).json({
      success: true,
      message: "Award deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const AwardController = {
  createAward,
  getAwards,
  updateAward,
  deleteAward,
};
