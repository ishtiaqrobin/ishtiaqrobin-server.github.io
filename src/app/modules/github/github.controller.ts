import { NextFunction, Request, Response } from "express";
import { GithubService } from "./github.service";

// ─── GitHub Stats ──────────────────────────────────────────────

// Get cached GitHub stats (public)
const getGithubStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await GithubService.getGithubStats();

    res.status(200).json({
      success: true,
      message: "GitHub stats retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Sync GitHub stats from the GitHub API (admin)
const syncGithubStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.body;
    const result = await GithubService.syncGithubStats(username as string);

    res.status(200).json({
      success: true,
      message: "GitHub stats synced successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Open Source Contributions ─────────────────────────────────

// Get all published contributions (public)
const getAllContributions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await GithubService.getAllContributions();

    res.status(200).json({
      success: true,
      message: "Retrieved all contributions successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all contributions including unpublished (admin)
const getAllContributionsAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await GithubService.getAllContributionsAdmin();

    res.status(200).json({
      success: true,
      message: "Retrieved all contributions successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get a single contribution by ID (admin)
const getContributionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { contributionId } = req.params;
    const result = await GithubService.getContributionById(
      contributionId as string,
    );

    res.status(200).json({
      success: true,
      message: "Contribution retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Create a contribution (admin)
const createContribution = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await GithubService.createContribution(req.body);

    res.status(201).json({
      success: true,
      message: "Contribution created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update a contribution (admin)
const updateContribution = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { contributionId } = req.params;
    const result = await GithubService.updateContribution(
      contributionId as string,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Contribution updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete a contribution (admin)
const deleteContribution = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { contributionId } = req.params;
    await GithubService.deleteContribution(contributionId as string);

    res.status(200).json({
      success: true,
      message: "Contribution deleted successfully",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const GithubController = {
  getGithubStats,
  syncGithubStats,
  getAllContributions,
  getAllContributionsAdmin,
  getContributionById,
  createContribution,
  updateContribution,
  deleteContribution,
};
