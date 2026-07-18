import express from "express";
import { SettingController } from "./setting.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { SettingValidation } from "./setting.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

router.get("/", SettingController.getSettings);

router.patch(
  "/",
  auth(UserRole.ADMIN),
  validateRequest(SettingValidation.updateSettingsZodSchema),
  SettingController.updateSettings,
);

export const SettingRouter = router;
