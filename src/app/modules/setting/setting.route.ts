import express from "express";
import { SettingController } from "./setting.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", SettingController.getSettings);

router.patch("/", auth(UserRole.ADMIN), SettingController.updateSettings);

export const SettingRouter = router;
