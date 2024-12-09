import Project from "../models/Project";
import User from "../models/User";

// Create a new project (only organization can create projects)
export const createProject = async (req, res) => {
    try {
        const { projectName, description, date, time, location } = req.body;

        // Ensure the user creating the project is an organization
        const organization = await User.findById(req.user.id);  // assuming req.user.id is the logged-in user id
        if (organization.role !== "organization") {
            return res.status(403).json({ message: "Only organizations can create projects." });
        }

        // Create the project
        const newProject = new Project({
            organizationId: organization._id,
            projectName,
            description,
            date,
            time,
            location,
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all projects (only approved projects should be visible)
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isApproved: true }); // Only fetch approved projects
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single project
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};