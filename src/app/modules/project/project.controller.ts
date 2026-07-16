import { NextFunction, Request, Response } from "express";
import { ProjectService } from "./project.service";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

// Helper — parse files + tags from multipart request
// const parseProjectPayload = (req: Request) => {
//   const payload: any = { ...req.body };
//   const files = req.files as Record<string, Express.Multer.File[]> | undefined;

//   if (files?.thumbnail?.[0]) {
//     payload.thumbnail = files.thumbnail[0].path;
//   }

//   if (files?.images?.length) {
//     payload.projectImages = files.images.map((file, idx) => ({
//       url: file.path,
//       alt: req.body[`alt_${idx}`] || undefined,
//     }));
//   }

//   if (payload.tags && typeof payload.tags === "string") {
//     try {
//       payload.tags = JSON.parse(payload.tags);
//     } catch {
//       payload.tags = payload.tags.split(",").map((t: string) => t.trim());
//     }
//   }

//   return payload;
// };

const parseProjectPayload = (req: Request) => {
  const payload: any = { ...req.body };
  const files = req.files as Record<string, Express.Multer.File[]> | undefined;

  if (files?.thumbnail?.[0]) {
    payload.thumbnail = files.thumbnail[0].path;
  }

  if (files?.bannerImage?.[0]) {
    payload.bannerImage = files.bannerImage[0].path;
  }

  if (payload.tags && typeof payload.tags === "string") {
    try {
      payload.tags = JSON.parse(payload.tags);
    } catch {
      payload.tags = payload.tags.split(",").map((t: string) => t.trim());
    }
  }

  if (payload.techStack && typeof payload.techStack === "string") {
    try {
      payload.techStack = JSON.parse(payload.techStack);
    } catch {
      payload.techStack = payload.techStack.split(",").map((t: string) => t.trim());
    }
  }

  if (payload.sections && typeof payload.sections === "string") {
    try {
      payload.sections = JSON.parse(payload.sections);
    } catch {
      payload.sections = [];
    }
  }

  return payload;
};

// Create project
const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ProjectService.createProject(parseProjectPayload(req));
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all projects
const getProjects = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { categoryId, isPublished, isFeatured } = req.query;
    const publishedFilter =
      isPublished === "true"
        ? true
        : isPublished === "false"
          ? false
          : undefined;

    const isFeaturedFilter =
      isFeatured === "true" ? true : isFeatured === "false" ? false : undefined;

    const result = await ProjectService.getProjects(
      categoryId as string,
      publishedFilter,
      isFeaturedFilter,
    );
    res.status(200).json({
      success: true,
      message: "Retrieved all projects successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get single project by id
const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {
    const result = await ProjectService.getProjectById(id as string);
    if (!result) {
      throw new AppError(status.NOT_FOUND, "Project not found");
    }
    res.status(200).json({
      success: true,
      message: "Retrieved project successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get single project by slug
const getProjectBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const slug = req.params.slug;
  try {
    const result = await ProjectService.getProjectBySlug(slug as string);
    if (!result) {
      throw new AppError(status.NOT_FOUND, "Project not found");
    }
    res.status(200).json({
      success: true,
      message: "Retrieved project successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update project
const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {
    const result = await ProjectService.updateProject(
      id as string,
      parseProjectPayload(req),
    );
    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete project
const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params.id;
  try {
    await ProjectService.deleteProject(id as string);
    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const ProjectController = {
  createProject,
  getProjects,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
};
