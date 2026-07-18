import { prisma } from "../../lib/prisma";
import {
  CreateAwardInput,
  UpdateAwardInput,
} from "./award.interface";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const parseAward = (award: Record<string, unknown>) => ({
  ...award,
  details: award.details
    ? JSON.parse(award.details as string)
    : [],
});

const serializePayload = (payload: Record<string, unknown>) => {
  const data = { ...payload };
  if (Array.isArray(data.details)) {
    data.details = JSON.stringify(data.details);
  }
  return data;
};

const createAward = async (payload: CreateAwardInput) => {
  const data = serializePayload(payload as unknown as Record<string, unknown>);
  const result = await prisma.award.create({ data: data as any });
  return parseAward(result as unknown as Record<string, unknown>);
};

const getAwards = async (isPublished?: boolean) => {
  const results = await prisma.award.findMany({
    where: {
      ...(isPublished !== undefined && { isPublished }),
    },
    orderBy: { sortOrder: "asc" },
  });
  return results.map((r) =>
    parseAward(r as unknown as Record<string, unknown>),
  );
};

const updateAward = async (id: string, payload: UpdateAwardInput) => {
  const current = await prisma.award.findUnique({ where: { id } });

  if (!current) {
    throw new AppError(status.NOT_FOUND, "Award not found");
  }

  const data = serializePayload(payload as unknown as Record<string, unknown>);
  const result = await prisma.award.update({
    where: { id },
    data: data as any,
  });
  return parseAward(result as unknown as Record<string, unknown>);
};

const deleteAward = async (id: string) => {
  const current = await prisma.award.findUnique({ where: { id } });

  if (!current) {
    throw new AppError(status.NOT_FOUND, "Award not found");
  }

  await prisma.award.delete({ where: { id } });
};

export const AwardService = {
  createAward,
  getAwards,
  updateAward,
  deleteAward,
};
