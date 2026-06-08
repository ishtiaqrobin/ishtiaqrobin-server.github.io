import { prisma } from "../../lib/prisma";
import {
  CreateCertificateInput,
  UpdateCertificateInput,
} from "./certificate.interface";
import { deleteFileFromCloudinary } from "../../config/cloudinary.config";

// Create certificate
const createCertificate = async (payload: CreateCertificateInput) => {
  const result = await prisma.certificate.create({
    data: payload as any,
  });
  return result;
};

// Get all certificates (with optional filtering)
const getCertificates = async (isPublished?: boolean) => {
  const result = await prisma.certificate.findMany({
    where: isPublished !== undefined ? { isPublished } : {},
    orderBy: {
      sortOrder: "asc",
    },
  });
  return result;
};

// Get single certificate
const getCertificateById = async (id: string) => {
  const result = await prisma.certificate.findUnique({
    where: { id },
  });
  return result;
};

// Update certificate
const updateCertificate = async (
  id: string,
  payload: UpdateCertificateInput,
) => {
  const current = await prisma.certificate.findUnique({ where: { id } });

  if (!current) {
    throw new Error("Certificate not found");
  }

  // Delete old image from Cloudinary if a new one is being uploaded
  if (
    payload.imageUrl &&
    current.imageUrl &&
    payload.imageUrl !== current.imageUrl
  ) {
    await deleteFileFromCloudinary(current.imageUrl);
  }

  const result = await prisma.certificate.update({
    where: { id },
    data: payload as any,
  });
  return result;
};

// Delete certificate
const deleteCertificate = async (id: string) => {
  const current = await prisma.certificate.findUnique({ where: { id } });

  if (!current) {
    throw new Error("Certificate not found");
  }

  // Delete image from Cloudinary if exists
  if (current.imageUrl) {
    await deleteFileFromCloudinary(current.imageUrl);
  }

  const result = await prisma.certificate.delete({ where: { id } });
  return result;
};

export const CertificateService = {
  createCertificate,
  getCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
};
