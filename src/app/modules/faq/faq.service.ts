import { prisma } from "../../lib/prisma";
import { CreateFaqInput, UpdateFaqInput } from "./faq.interface";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const createFaq = async (payload: CreateFaqInput) => {
  const result = await prisma.faq.create({ data: payload as any });
  return result;
};

const getFaqs = async (isPublished?: boolean) => {
  const results = await prisma.faq.findMany({
    where: {
      ...(isPublished !== undefined && { isPublished }),
    },
    orderBy: { sortOrder: "asc" },
  });
  return results;
};

const updateFaq = async (id: string, payload: UpdateFaqInput) => {
  const current = await prisma.faq.findUnique({ where: { id } });

  if (!current) {
    throw new AppError(status.NOT_FOUND, "FAQ not found");
  }

  const result = await prisma.faq.update({
    where: { id },
    data: payload as any,
  });
  return result;
};

const deleteFaq = async (id: string) => {
  const current = await prisma.faq.findUnique({ where: { id } });

  if (!current) {
    throw new AppError(status.NOT_FOUND, "FAQ not found");
  }

  await prisma.faq.delete({ where: { id } });
};

export const FaqService = {
  createFaq,
  getFaqs,
  updateFaq,
  deleteFaq,
};
