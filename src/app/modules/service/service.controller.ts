import { NextFunction, Request, Response } from "express";
import { ServiceService } from "./service.service";

// Create service
const createService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ServiceService.createService(req.body);
    res.status(201).json({
      success: true,
      message: "Service created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all services
const getServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { isPublished } = req.query;
    const publishedFilter =
      isPublished === "true"
        ? true
        : isPublished === "false"
          ? false
          : undefined;

    const result = await ServiceService.getServices(publishedFilter);
    res.status(200).json({
      success: true,
      message: "Retrieved all services successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update service
const updateService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await ServiceService.updateService(id as string, req.body);
    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete service
const deleteService = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await ServiceService.deleteService(id as string);
    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const ServiceController = {
  createService,
  getServices,
  updateService,
  deleteService,
};
