import { prisma } from "../../lib/prisma";
import {
  CreateExperienceInput,
  UpdateExperienceInput,
} from "./experience.interface";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const parseExperience = (exp: Record<string, unknown>) => ({
  ...exp,
  responsibilities: exp.responsibilities
    ? JSON.parse(exp.responsibilities as string)
    : [],
});

const serializePayload = (payload: Record<string, unknown>) => {
  const data = { ...payload };
  if (data.startDate) {
    data.startDate = new Date(data.startDate as string).toISOString();
  }
  if (data.endDate) {
    data.endDate = new Date(data.endDate as string).toISOString();
  }
  if (Array.isArray(data.responsibilities)) {
    data.responsibilities = JSON.stringify(data.responsibilities);
  }
  return data;
};

const createExperience = async (payload: CreateExperienceInput) => {
  const data = serializePayload(payload as unknown as Record<string, unknown>);
  const result = await prisma.experience.create({ data: data as any });
  return parseExperience(result as unknown as Record<string, unknown>);
};

const getExperiences = async (isPublished?: boolean) => {
  const results = await prisma.experience.findMany({
    where: {
      ...(isPublished !== undefined && { isPublished }),
    },
    orderBy: { sortOrder: "asc" },
  });
  return results.map((r) =>
    parseExperience(r as unknown as Record<string, unknown>),
  );
};

const updateExperience = async (id: string, payload: UpdateExperienceInput) => {
  const current = await prisma.experience.findUnique({ where: { id } });

  if (!current) {
    throw new AppError(status.NOT_FOUND, "Experience not found");
  }

  if (
    payload.companyLogo &&
    current.companyLogo &&
    payload.companyLogo !== current.companyLogo
  ) {
    await deleteFileFromCloudinary(current.companyLogo);
  }

  const data = serializePayload(payload as unknown as Record<string, unknown>);
  const result = await prisma.experience.update({
    where: { id },
    data: data as any,
  });
  return parseExperience(result as unknown as Record<string, unknown>);
};

const deleteExperience = async (id: string) => {
  const current = await prisma.experience.findUnique({ where: { id } });

  if (!current) {
    throw new AppError(status.NOT_FOUND, "Experience not found");
  }

  if (current.companyLogo) {
    await deleteFileFromCloudinary(current.companyLogo);
  }

  await prisma.experience.delete({ where: { id } });
};

export const ExperienceService = {
  createExperience,
  getExperiences,
  updateExperience,
  deleteExperience,
};
