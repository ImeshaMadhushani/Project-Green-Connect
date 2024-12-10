import express from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject, approveProject } from "../controllers/projectController";

const projectRouter = express.Router();

// Create project (only organizations can create)
projectRouter.post("/", createProject);

// Get all projects (only approved projects are visible)
projectRouter.get("/", getProjects);

// Get a specific project by ID
projectRouter.get("/:projectId", getProjectById);

// Update project (only the organization that created the project can update)
projectRouter.put("/:projectId", updateProject);

// Delete project (only admins can delete projects)
projectRouter.delete("/:projectId", deleteProject);

// Approve project (only admins can approve)
projectRouter.patch("/:projectId/approve", approveProject);

export default projectRouter;
