import { prisma } from "../../lib/prisma";
import { CreateProjectInput, UpdateProjectInput } from "./project.interface";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const projectInclude = {
  category: true,
  images: { orderBy: { sortOrder: "asc" } },
} as const;

// Create project
const createProject = async (payload: CreateProjectInput) => {
  const { projectImages, ...projectData } = payload;

  const result = await prisma.project.create({
    data: {
      ...projectData,
      ...(projectImages?.length && {
        images: {
          create: projectImages.map((img, idx) => ({
            url: img.url,
            alt: img.alt || null,
            sortOrder: img.sortOrder ?? idx,
          })),
        },
      }),
    },
    include: projectInclude,
  });
  return result;
};

// Get all projects
const getProjects = async (
  categoryId?: string,
  isPublished?: boolean,
  isFeatured?: boolean,
) => {
  const result = await prisma.project.findMany({
    where: {
      ...(categoryId && { categoryId }),
      ...(isPublished !== undefined && { isPublished }),
      ...(isFeatured !== undefined && { isFeatured }),
    },
    include: projectInclude,
    orderBy: {
      sortOrder: "asc",
    },
  });
  return result;
};

// Get single project
const getProjectById = async (id: string) => {
  const result = await prisma.project.findUnique({
    where: { id },
    include: projectInclude,
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  return result;
};

// Update project
const updateProject = async (id: string, payload: UpdateProjectInput) => {
  const current = await prisma.project.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!current) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  // Delete old thumbnail from Cloudinary if new one is being uploaded
  if (
    payload.thumbnail &&
    current.thumbnail &&
    payload.thumbnail !== current.thumbnail
  ) {
    await deleteFileFromCloudinary(current.thumbnail);
  }

  const { projectImages, ...updateData } = payload;

  const result = await prisma.project.update({
    where: { id },
    data: {
      ...updateData,
      // Replace all images if new ones are provided
      ...(projectImages?.length && {
        images: {
          deleteMany: {},
          create: projectImages.map((img, idx) => ({
            url: img.url,
            alt: img.alt || null,
            sortOrder: img.sortOrder ?? idx,
          })),
        },
      }),
    } as any,
    include: projectInclude,
  });
  return result;
};

// Delete project
const deleteProject = async (id: string) => {
  const current = await prisma.project.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!current) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  // Delete thumbnail and all images from Cloudinary
  const urlsToDelete = [
    current.thumbnail,
    ...current.images.map((img) => img.url),
  ].filter(Boolean) as string[];

  await Promise.all(urlsToDelete.map(deleteFileFromCloudinary));

  await prisma.project.delete({ where: { id } });
};

export const ProjectService = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
