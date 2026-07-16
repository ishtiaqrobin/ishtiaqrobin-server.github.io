import { prisma } from "../../lib/prisma";
import { CreateProjectInput, UpdateProjectInput } from "./project.interface";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const projectInclude = {
  category: true,
} as const;

// Create project
const createProject = async (payload: CreateProjectInput) => {
  const { techStack, sections, ...projectData } = payload;

  const result = await prisma.project.create({
    data: {
      ...projectData,
      techStack: techStack || [],
      sections: sections || undefined,
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

// Get single project by id
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

// Get single project by slug
const getProjectBySlug = async (slug: string) => {
  const result = await prisma.project.findUnique({
    where: { slug },
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

  // Delete old bannerImage from Cloudinary if new one is being uploaded
  if (
    payload.bannerImage &&
    current.bannerImage &&
    payload.bannerImage !== current.bannerImage
  ) {
    await deleteFileFromCloudinary(current.bannerImage);
  }

  const { techStack, sections, ...updateData } = payload;

  const result = await prisma.project.update({
    where: { id },
    data: {
      ...updateData,
      ...(techStack !== undefined && { techStack }),
      ...(sections !== undefined && { sections }),
    } as any,
    include: projectInclude,
  });
  return result;
};

// Delete project
const deleteProject = async (id: string) => {
  const current = await prisma.project.findUnique({
    where: { id },
  });

  if (!current) {
    throw new AppError(status.NOT_FOUND, "Project not found");
  }

  // Delete thumbnail and bannerImage from Cloudinary
  const urlsToDelete = [
    current.thumbnail,
    current.bannerImage,
  ].filter(Boolean) as string[];

  await Promise.all(urlsToDelete.map(deleteFileFromCloudinary));

  await prisma.project.delete({ where: { id } });
};

export const ProjectService = {
  createProject,
  getProjects,
  getProjectById,
  getProjectBySlug,
  updateProject,
  deleteProject,
};
