import express from "express";
import { createProject, getProjects, getProjectById, updateProject, deleteProject, updateProjectStatus, getNotApprovedProjects, enrollProject, unenrollProject, getOrganizationProjects, getVolunteerProjects,  getEnrolledUsers, getApprovedProjectsCount, getEnrolledUsersCount, getAllProjects  } from "../controllers/projectController.js";

const projectRouter = express.Router();

// Create project (only organizations can create)
projectRouter.post("/", createProject);

// Get all projects (only approved projects are visible)
projectRouter.get("/", getProjects);

// Get all projects that are not approved
projectRouter.get("/notapp", getNotApprovedProjects);


//get all projects
projectRouter.get("/all", getAllProjects);

// Get a specific project by ID
projectRouter.get("/:id", getProjectById);

// Update project (only the organization that created the project can update)
projectRouter.put("/:id", updateProject);

// Delete project (only admins can delete projects)
projectRouter.delete("/:id", deleteProject);

// Approve project (only admins can approve)
projectRouter.put("/:id/status", updateProjectStatus);

//enroll project
projectRouter.put("/:id/enroll", enrollProject);

//unenrollProject
projectRouter.put("/:id/unenroll", unenrollProject);

// Get all projects created by a specific organization
projectRouter.get("/organization/:id", getOrganizationProjects);

// Get all enrolled users for a specific project
projectRouter.get("/:id/enrolled-users", getVolunteerProjects);

// Get all projects volunteers are enrolled in
projectRouter.get("/volunteer/:id", getEnrolledUsers);

//get count of approved projects

projectRouter.get("/approved/count", getApprovedProjectsCount);

//get count of enrolled users for a specific project

projectRouter.get("/:id/enrolledcount", getEnrolledUsersCount);


export default projectRouter;
