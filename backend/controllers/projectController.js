import Project from "../models/Project.js";
import User from "../models/User.js";

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

// Get all projects that are not approved
export const getNotApprovedProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isApproved: false }); // Fetch only projects that are not approved
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

// Update a project (only an organization can update its own projects)
export const updateProject = async (req, res) => {
    try {
        const { projectName, description, date, time, location } = req.body;

        // Check if the project exists
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

       
        if (project.organizationId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this project" });
        }

        // Update project details
        project.projectName = projectName || project.projectName;
        project.description = description || project.description;
        project.date = date || project.date;
        project.time = time || project.time;
        project.location = location || project.location;

        await project.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a project (only an admin can delete a project)
export const deleteProject = async (req, res) => {
    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can delete projects" });
        }

        // Check if the project exists
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Delete the project
        //await project.remove();
        
        await Project.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Approve a project (only admin can approve)
export const updateProjectStatus = async (req, res) => {
    try {
        // Check if the user is an admin
        const user = await User.findById(req.user.id);
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can approve projects" });
        }

        // Check if the project exists
        const project = await Project.findById(req.params.id);
        console.log('Project ID:', req.params.id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check for status parameter and update project
        const { status } = req.body;

        // Only "approved" or "rejected" statuses are valid
        if (status !== "approved" && status !== "rejected") {
            return res.status(400).json({ message: "Invalid status, must be 'approved' or 'rejected'" });
        }

        // Approve the project
       /*  project.isApproved = true;
        project.approveDate = new Date();
        project.endDate = new Date(project.approveDate);
        project.endDate.setDate(project.endDate.getDate() + 14); // Set the end date 14 days from approval date
 */
        // Update project status and set appropriate fields
        project.status = status;
        project.isApproved = status === "approved";

        if (status === "approved") {
            project.approveDate = new Date();
            project.endDate = new Date(project.approveDate);
            project.endDate.setDate(project.endDate.getDate() + 14); // Set the end date 14 days from approval date
        } else if (status === "rejected") {
            project.rejectionDate = new Date();  // Optionally, you can track the rejection date
        }

        await project.save();
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
