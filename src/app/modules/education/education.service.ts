import { prisma } from "../../lib/prisma";
import {
  CreateEducationInput,
  UpdateEducationInput,
} from "./education.interface";

// Create education
const createEducation = async (payload: CreateEducationInput) => {
  const data = { ...payload } as any;
  if (data.startDate) {
    data.startDate = new Date(data.startDate).toISOString();
  }
  if (data.endDate) {
    data.endDate = new Date(data.endDate).toISOString();
  }

  const result = await prisma.education.create({
    data,
  });
  return result;
};

// Get all educations
const getEducations = async (isPublished?: boolean) => {
  const result = await prisma.education.findMany({
    where: {
      ...(isPublished !== undefined && { isPublished }),
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
  return result;
};

// Update education
const updateEducation = async (id: string, payload: UpdateEducationInput) => {
  const data = { ...payload } as any;
  if (data.startDate) {
    data.startDate = new Date(data.startDate).toISOString();
  }
  if (data.endDate) {
    data.endDate = new Date(data.endDate).toISOString();
  }

  const result = await prisma.education.update({
    where: { id },
    data,
  });
  return result;
};

// Delete education
const deleteEducation = async (id: string) => {
  const result = await prisma.education.delete({
    where: { id },
  });
  return result;
};

export const EducationService = {
  createEducation,
  getEducations,
  updateEducation,
  deleteEducation,
};
