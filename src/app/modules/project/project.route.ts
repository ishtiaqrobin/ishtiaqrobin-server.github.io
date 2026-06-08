import express, { Router } from "express";
import { ProjectController } from "./project.controller";
import auth, { UserRole } from "../../middlewares/auth";
import { ProjectValidation } from "./project.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { createMulterUpload } from "../../config/multer.config";

const projectUpload = createMulterUpload("projects");

const router = express.Router();

// Get all projects
router.get("/", ProjectController.getProjects);

// Get single project
router.get("/:id", ProjectController.getProjectById);

// Create project
router.post(
  "/",
  auth(UserRole.ADMIN),
  projectUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  validateRequest(ProjectValidation.createProjectZodSchema),
  ProjectController.createProject,
);

// Update project
router.put(
  "/:id",
  auth(UserRole.ADMIN),
  projectUpload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  validateRequest(ProjectValidation.updateProjectZodSchema),
  ProjectController.updateProject,
);

// Delete project
router.delete("/:id", auth(UserRole.ADMIN), ProjectController.deleteProject);

export const ProjectRouter: Router = router;
