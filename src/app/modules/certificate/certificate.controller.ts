import { NextFunction, Request, Response } from "express";
import { CertificateService } from "./certificate.service";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

/** Convert a date string (YYYY-MM-DD or ISO) to a full ISO-8601 DateTime string.
 *  Prisma DateTime fields require a full ISO string — date-only strings are rejected.
 */
const toISODateTime = (value: unknown): string | undefined => {
  if (!value || typeof value !== "string") return undefined;
  // Already a full ISO string (contains "T")
  if (value.includes("T")) return new Date(value).toISOString();
  // Date-only: "YYYY-MM-DD" → append midnight UTC
  return new Date(`${value}T00:00:00.000Z`).toISOString();
};

// Create certificate
const createCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload = { ...req.body };

    // Convert date fields to full ISO DateTime
    if (payload.issuedDate)
      payload.issuedDate = toISODateTime(payload.issuedDate);
    if (payload.expiryDate)
      payload.expiryDate = toISODateTime(payload.expiryDate);

    // Add image to payload if a file was uploaded
    if (req.file) {
      payload.imageUrl = req.file.path;
    }

    const result = await CertificateService.createCertificate(payload as any);
    res.status(201).json({
      success: true,
      message: "Certificate created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get all certificates
const getCertificates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { isPublished } = req.query;
    const publishedFilter =
      isPublished === "true"
        ? true
        : isPublished === "false"
          ? false
          : undefined;

    const result = await CertificateService.getCertificates(publishedFilter);
    res.status(200).json({
      success: true,
      message: "Retrieved certificates successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get single certificate
const getCertificateById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await CertificateService.getCertificateById(id as string);
    if (!result) {
      throw new AppError(status.NOT_FOUND, "Certificate not found");
    }
    res.status(200).json({
      success: true,
      message: "Retrieved certificate successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update certificate
const updateCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    // Convert date fields to full ISO DateTime
    if (payload.issuedDate)
      payload.issuedDate = toISODateTime(payload.issuedDate);
    if (payload.expiryDate)
      payload.expiryDate = toISODateTime(payload.expiryDate);

    if (req.file) {
      payload.imageUrl = req.file.path;
    }

    const result = await CertificateService.updateCertificate(
      id as string,
      payload,
    );
    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Delete certificate
const deleteCertificate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const result = await CertificateService.deleteCertificate(id as string);
    res.status(200).json({
      success: true,
      message: "Certificate deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const CertificateController = {
  createCertificate,
  getCertificates,
  getCertificateById,
  updateCertificate,
  deleteCertificate,
};
