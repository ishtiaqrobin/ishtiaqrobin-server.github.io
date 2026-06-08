import express from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { StatsController } from "./stats.controller";

const router = express.Router();

router.patch("/", auth(UserRole.ADMIN), StatsController.updatePublicStats);

router.get("/", StatsController.getPublicStats);

export const StatsRouter = router;
