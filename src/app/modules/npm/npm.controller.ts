import { NextFunction, Request, Response } from "express";
import { NpmService } from "./npm.service";

// ─── Sync ──────────────────────────────────────────────────────

// Sync a package's stats from the npm API (admin)
const syncNpmPackage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;
    const result = await NpmService.syncNpmPackage(name as string);

    res.status(200).json({
      success: true,
      message: "npm package synced successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ─── CRUD ──────────────────────────────────────────────────────

// Get all published packages (public)
const getAllNpmPackages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await NpmService.getAllNpmPackages();

    res.status(200).json({
      success: true,
      message: "Retrieved all npm packages successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all packages including unpublished (admin)
const getAllNpmPackagesAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await NpmService.getAllNpmPackagesAdmin();

    res.status(200).json({
      success: true,
      message: "Retrieved all npm packages successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get a single package by ID (admin)
const getNpmPackageById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { packageId } = req.params;
    const result = await NpmService.getNpmPackageById(packageId as string);

    res.status(200).json({
      success: true,
      message: "npm package retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Create a package (admin)
const createNpmPackage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await NpmService.createNpmPackage(req.body);

    res.status(201).json({
      success: true,
      message: "npm package created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update a package (admin)
const updateNpmPackage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { packageId } = req.params;
    const result = await NpmService.updateNpmPackage(
      packageId as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "npm package updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a package (admin)
const deleteNpmPackage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { packageId } = req.params;
    await NpmService.deleteNpmPackage(packageId as string);

    res.status(200).json({
      success: true,
      message: "npm package deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const NpmController = {
  syncNpmPackage,
  getAllNpmPackages,
  getAllNpmPackagesAdmin,
  getNpmPackageById,
  createNpmPackage,
  updateNpmPackage,
  deleteNpmPackage,
};
