import express, { Router } from "express";
import multer from "multer";
import { AwardController } from "./award.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { AwardValidation } from "./award.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const awardUpload = multer();

const router = express.Router();

router.get("/", AwardController.getAwards);

router.post(
  "/",
  auth(UserRole.ADMIN),
  awardUpload.none(),
  validateRequest(AwardValidation.createAwardZodSchema),
  AwardController.createAward,
);

router.put(
  "/:id",
  auth(UserRole.ADMIN),
  awardUpload.none(),
  validateRequest(AwardValidation.updateAwardZodSchema),
  AwardController.updateAward,
);

router.delete("/:id", auth(UserRole.ADMIN), AwardController.deleteAward);

export const AwardRouter: Router = router;
