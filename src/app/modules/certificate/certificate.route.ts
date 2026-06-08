import express, { Router } from "express";
import { CertificateController } from "./certificate.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { CertificateValidation } from "./certificate.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { createMulterUpload } from "../../config/multer.config";

const certificateImageUpload = createMulterUpload("certificates");

const router = express.Router();

// Get all certificates
router.get("/", CertificateController.getCertificates);

// Get single certificate
router.get("/:id", CertificateController.getCertificateById);

// Create certificate
router.post(
  "/",
  auth(UserRole.ADMIN),
  certificateImageUpload.single("imageUrl"),
  validateRequest(CertificateValidation.createCertificateZodSchema),
  CertificateController.createCertificate,
);

// Update certificate
router.put(
  "/:id",
  auth(UserRole.ADMIN),
  certificateImageUpload.single("imageUrl"),
  validateRequest(CertificateValidation.updateCertificateZodSchema),
  CertificateController.updateCertificate,
);

// Delete certificate
router.delete(
  "/:id",
  auth(UserRole.ADMIN),
  CertificateController.deleteCertificate,
);

export const CertificateRouter: Router = router;
