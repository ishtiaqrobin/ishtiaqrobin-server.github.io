import { prisma } from "../../lib/prisma";
import {
  CreateExperienceInput,
  UpdateExperienceInput,
} from "./experience.interface";

// Create experience
const createExperience = async (payload: CreateExperienceInput) => {
  const data = { ...payload } as any;
  if (data.startDate) {
    data.startDate = new Date(data.startDate).toISOString();
  }
  if (data.endDate) {
    data.endDate = new Date(data.endDate).toISOString();
  }

  const result = await prisma.experience.create({
    data,
  });
  return result;
};

// Get all experiences
const getExperiences = async (isPublished?: boolean) => {
  const result = await prisma.experience.findMany({
    where: {
      ...(isPublished !== undefined && { isPublished }),
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
  return result;
};

// Update experience
const updateExperience = async (id: string, payload: UpdateExperienceInput) => {
  const data = { ...payload } as any;
  if (data.startDate) {
    data.startDate = new Date(data.startDate).toISOString();
  }
  if (data.endDate) {
    data.endDate = new Date(data.endDate).toISOString();
  }

  const result = await prisma.experience.update({
    where: { id },
    data,
  });
  return result;
};

// Delete experience
const deleteExperience = async (id: string) => {
  const result = await prisma.experience.delete({
    where: { id },
  });
  return result;
};

export const ExperienceService = {
  createExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
};
