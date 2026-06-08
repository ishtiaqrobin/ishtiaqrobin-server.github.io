import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { AdminController } from "./admin.controller";

const router = express.Router();

// Get all users (Admin only)
router.get("/users", auth(UserRole.ADMIN), AdminController.getAllUsers);

// Ban user (Admin only)
router.patch(
  "/users/:userId/ban",
  auth(UserRole.ADMIN),
  AdminController.banUser,
);

// Unban user (Admin only)
router.patch(
  "/users/:userId/unban",
  auth(UserRole.ADMIN),
  AdminController.unbanUser,
);

// Get dashboard statistics (Admin only)
router.get("/stats", auth(UserRole.ADMIN), AdminController.getDashboardStats);

export const AdminRouter: Router = router;
