import { deleteFileFromCloudinary } from "../../config/cloudinary.config";
import { prisma } from "../../lib/prisma";
import { CreateGalleryInput, UpdateGalleryInput } from "./gallery.interface";

// Create gallery
const createGallery = async (payload: CreateGalleryInput) => {
  const result = await prisma.gallery.create({
    data: payload as any,
  });
  return result;
};

// Get all galleries
const getGalleries = async (isPublished?: boolean) => {
  const result = await prisma.gallery.findMany({
    where: {
      ...(isPublished !== undefined && { isPublished }),
    },
    orderBy: {
      sortOrder: "asc",
    },
  });
  return result;
};

// Get single gallery
const getGalleryById = async (id: string) => {
  const result = await prisma.gallery.findUnique({
    where: { id },
  });
  return result;
};

// Update gallery
const updateGallery = async (id: string, payload: UpdateGalleryInput) => {
  const current = await prisma.gallery.findUnique({ where: { id } });

  if (!current) {
    throw new Error("Gallery not found");
  }

  // Delete old image from Cloudinary if a new one is being uploaded
  if (payload.image && current.image && payload.image !== current.image) {
    await deleteFileFromCloudinary(current.image);
  }

  const result = await prisma.gallery.update({
    where: { id },
    data: payload as any,
  });
  return result;
};

// Delete gallery
const deleteGallery = async (id: string) => {
  const current = await prisma.gallery.findUnique({ where: { id } });

  if (!current) {
    throw new Error("Gallery not found");
  }

  // Delete image from Cloudinary if exists
  if (current.image) {
    await deleteFileFromCloudinary(current.image);
  }

  const result = await prisma.gallery.delete({
    where: { id },
  });
  return result;
};

export const GalleryService = {
  createGallery,
  getGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
};
