import express from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject, updateProjectStatus } from "../controllers/projectController.js";

const projectRouter = express.Router();

// Create project (only organizations can create)
projectRouter.post("/", createProject);

// Get all projects (only approved projects are visible)
projectRouter.get("/", getProjects);

// Get a specific project by ID
projectRouter.get("/:id", getProjectById);

// Update project (only the organization that created the project can update)
projectRouter.put("/:id", updateProject);

// Delete project (only admins can delete projects)
projectRouter.delete("/:id", deleteProject);

// Approve project (only admins can approve)
projectRouter.put("/:id/status", updateProjectStatus);

export default projectRouter;
