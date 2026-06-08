import express, { Router } from "express";
import { ServiceController } from "./service.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { ServiceValidation } from "./service.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// Get all services
router.get("/", ServiceController.getServices);

// Create service
router.post(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(ServiceValidation.createServiceZodSchema),
  ServiceController.createService,
);

// Update service
router.put(
  "/:id",
  auth(UserRole.ADMIN),
  validateRequest(ServiceValidation.updateServiceZodSchema),
  ServiceController.updateService,
);

// Delete service
router.delete("/:id", auth(UserRole.ADMIN), ServiceController.deleteService);

export const ServiceRouter: Router = router;
