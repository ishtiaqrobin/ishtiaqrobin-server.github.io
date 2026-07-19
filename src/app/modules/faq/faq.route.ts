import express, { Router } from "express";
import multer from "multer";
import { FaqController } from "./faq.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { FaqValidation } from "./faq.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const faqUpload = multer();

const router = express.Router();

router.get("/", FaqController.getFaqs);

router.post(
  "/",
  auth(UserRole.ADMIN),
  faqUpload.none(),
  validateRequest(FaqValidation.createFaqZodSchema),
  FaqController.createFaq,
);

router.put(
  "/:id",
  auth(UserRole.ADMIN),
  faqUpload.none(),
  validateRequest(FaqValidation.updateFaqZodSchema),
  FaqController.updateFaq,
);

router.delete("/:id", auth(UserRole.ADMIN), FaqController.deleteFaq);

export const FaqRouter: Router = router;
