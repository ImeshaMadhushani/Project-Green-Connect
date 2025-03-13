import Project from "../models/Project.js";
import User from "../models/User.js";

// Create a new project (only organization can create projects)
export const createProject = async (req, res) => {
    try {
        console.log("Incoming request body:", req.body); 

        const { projectName, description, date, time, location, projectType, noOfVolunteers, projectDuration } = req.body;

        // Ensure the user creating the project is an organization
        const user = await User.findById(req.user.id);  // assuming req.user.id is the logged-in user id
        if (user.role !== "organization") {
            return res.status(403).json({ message: "Only organizations can create projects." });
        }

        // Create the project
        const newProject = new Project({
            organizationId: user._id,
            projectName,
            description,
            date,
            time,
            location,
            projectType,
            noOfVolunteers,
            projectDuration,
            status: "pending",
            isApproved: false,
        });

        await newProject.save();
        res.status(201).json(newProject);
    } catch (error) {
        console.error("Server Error:", error);
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

        if (status.toLowerCase() === "approved") {
            const approvalDate = new Date();
            const endDate = new Date(approvalDate);
            endDate.setDate(endDate.getDate() + 14); // Set the end date 14 days from approval date
           
            project.approveDate = approvalDate;
            project.endDate = endDate;  // Assign `endDate` before saving
           
            /* project.approveDate = new Date();
            project.endDate = new Date(project.approveDate);
            project.endDate.setDate(project.endDate.getDate() + 14); */ // Set the end date 14 days from approval date
        } else if (status.toLowerCase() === "rejected") {
            project.rejectionDate = new Date();  // Optionally, you can track the rejection date
            project.endDate = null; // Reset endDate if rejected
        }

        await project.save();
        res.status(200).json(project);
    } catch (error) {
        console.error("Error updating project status:", error);
        res.status(500).json({ message: error.message });
    }
};


//enrolle project
export const enrollProject = async (req, res) => { 
    try {

        // Ensure the user is authenticated
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized: No user found in request" });
        }

        // Check if the user is a volunteer
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "volunteer") {
            return res.status(403).json({ message: "Only volunteers can enroll in projects" });
        }
        // Check if the project exists
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Check if the user is already enrolled in the project
        if (project.volunteers.includes(req.user.id)) {
            return res.status(400).json({ message: "You are already enrolled in this project" });
        }
        
        // Enroll the user in the project
        project.volunteers.push(req.user.id);
        await project.save();
        res.status(200).json({ success: true, message: "Project enrolled successfully", enrolledUser: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        console.error("Enrollment Error:", error);
        res.status(500).json({ success: false, message: "Internal server error: " + error.message });
    }
};

//unenrol project
export const unenrollProject = async (req, res) => {
    try {
        // Check if the user is a volunteer
        const user = await User.findById(req.user.id);
        if (user.role !== "volunteer") {
            return res.status(403).json({ message: "Only volunteers can unenroll from projects" });
        }

        // Check if the project exists
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        
        // Check if the user is enrolled in the project
        if (!project.volunteers.includes(req.user.id)) {
            return res.status(400).json({ message: "You are not enrolled in this project" });
        }
        
        // Unenroll the user from the project
        project.volunteers = project.volunteers.filter(volunteerId => volunteerId.toString() !== req.user.id);
        await project.save();
        res.status(200).json({ message: "Project unenrolled successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
        }
}

// Get all projects created by a specific organization
export const getOrganizationProjects = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        // Check if the user is an organization
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "organization") {
            return res.status(403).json({ message: "Only organizations can view their projects" });
        }

        // Get all projects created by the organization
        const projects = await Project
            .find({ organizationId: req.user.id })
            .populate("organizationId", "name email")
            .populate("volunteers", "name email")
          /*   .exec(); */
        res.status(200).json(projects);
    }
    catch (error) {
        console.error("Error fetching organization projects:", error);
        res.status(500).json({ message: error.message });
    }
}

// Get all projects by a specific volunteer
export const getVolunteerProjects = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        // Check if the user is a volunteer
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "volunteer") {
            return res.status(403).json({ message: "Only volunteers can view their projects" });
        }
        // Get all projects created by the volunteer
        const projects = await Project
            .find({ volunteers: { $in: [req.user.id] } })
            .populate("organizationId", "name email")
            .populate("volunteers", "name email")
            /* .exec(); */
        res.status(200).json(projects);
    }
    catch (error) {
        console.error("Error fetching volunteer projects:", error);
        res.status(500).json({ message: error.message });
    }
}
    