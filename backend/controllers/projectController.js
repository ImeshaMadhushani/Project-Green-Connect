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
