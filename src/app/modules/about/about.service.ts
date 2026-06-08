import { prisma } from "../../lib/prisma";
import { CreateAboutInput, UpdateAboutInput } from "./about.interface";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";

// Create/Update about (upsert — singleton)
const createAbout = async (payload: CreateAboutInput) => {
  const result = await prisma.about.upsert({
    where: { id: "singleton" },
    update: payload as any,
    create: { id: "singleton", ...payload } as any,
  });
  return result;
};

// Get about (singleton)
const getAbout = async () => {
  const result = await prisma.about.findUnique({
    where: { id: "singleton" },
  });
  return result;
};

// Update about
const updateAbout = async (payload: UpdateAboutInput) => {
  const current = await prisma.about.findUnique({
    where: { id: "singleton" },
  });

  // Delete old images from Cloudinary if new ones are being uploaded
  if (
    payload.heroImg &&
    current?.heroImg &&
    payload.heroImg !== current.heroImg
  ) {
    await deleteFileFromCloudinary(current.heroImg);
  }
  if (
    payload.aboutMeImg &&
    current?.aboutMeImg &&
    payload.aboutMeImg !== current.aboutMeImg
  ) {
    await deleteFileFromCloudinary(current.aboutMeImg);
  }

  const result = await prisma.about.update({
    where: { id: "singleton" },
    data: payload as any,
  });
  return result;
};

// Download resume — increment counter
const downloadResume = async () => {
  const result = await prisma.about.update({
    where: { id: "singleton" },
    data: {
      resumeDownloadCount: { increment: 1 },
    },
  });
  return result;
};

export const AboutService = {
  createAbout,
  getAbout,
  updateAbout,
  downloadResume,
};
