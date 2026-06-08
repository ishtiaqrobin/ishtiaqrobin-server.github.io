import { NextFunction, Request, Response } from "express";
import { GalleryService } from "./gallery.service";

// Create gallery
const createGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = { ...req.body };

    // Add image to payload if a file was uploaded
    if (req.file) {
      payload.image = req.file.path;
    }

    const result = await GalleryService.createGallery(payload);
    res.status(201).json({
      success: true,
      message: "Gallery created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all galleries
const getGalleries = async (
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

    const result = await GalleryService.getGalleries(publishedFilter);
    res.status(200).json({
      success: true,
      message: "Retrieved all galleries successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get single gallery
const getGalleryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await GalleryService.getGalleryById(id as string);
    res.status(200).json({
      success: true,
      message: "Retrieved gallery successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update gallery
const updateGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (req.file) {
      payload.image = req.file.path;
    }

    const result = await GalleryService.updateGallery(id as string, payload);
    res.status(200).json({
      success: true,
      message: "Gallery updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete gallery
const deleteGallery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await GalleryService.deleteGallery(id as string);
    res.status(200).json({
      success: true,
      message: "Gallery deleted successfully",
      // data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const GalleryController = {
  createGallery,
  getGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
