import { prisma } from "../../lib/prisma";
import { CreateServiceInput, UpdateServiceInput } from "./service.interface";

// Create service
const createService = async (payload: CreateServiceInput) => {
  const result = await prisma.service.create({
    data: payload as any,
  });
  return result;
};

// Get all services
const getServices = async (isPublished?: boolean) => {
  const result = await prisma.service.findMany({
    where: {
      ...(isPublished !== undefined && { isPublished }),
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
  return result;
};

// Update service
const updateService = async (id: string, payload: UpdateServiceInput) => {
  const result = await prisma.service.update({
    where: { id },
    data: payload as any,
  });
  return result;
};

// Delete service
const deleteService = async (id: string) => {
  const result = await prisma.service.delete({
    where: { id },
  });
  return result;
};

export const ServiceService = {
  createService,
  getServices,
  updateService,
  deleteService,
};
