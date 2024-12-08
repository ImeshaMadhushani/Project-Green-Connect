import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//import dotenv from 'dotenv';


// Register a new user
export async function register(req, res) {
    const { name, username, email, password, profile_picture, role, legalDocument } = req.body;
    const saltRound = 10;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Additional checks for organizations
        if (role === "organization" && !legalDocument) {
            return res.status(400).json({ message: "Legal document is required for organizations" });
        }

        const hashedPassword = bcrypt.hashSync(password, saltRound);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            profile_picture,
            role,
            legalDocument: role === "organization" ? legalDocument : undefined,
            isApproved: role === "organization" ? false : undefined,
        });

        await newUser.save();
        console.log("Received new user:", req.body);

        const message = role === "organization"
            ? "Organization registered successfully. Awaiting admin approval."
            : "User registered successfully";

        res.status(201).json({ message });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Error creating user!", error: error.message });
    }
}
// Login

export function login(req, res) {
    const credentials = req.body;

    User.findOne({ username: credentials.username }).then((user) => {
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        } 
        
        if (user.role === "organization" && !user.isApproved) {
            return res.status(403).json({ message: "Organization account is not approved yet." });
        }
            const isPasswordValid = bcrypt.compare(credentials.password, user.password)
            if (!isPasswordValid) {
                res.status(401).json({ message: "Invalid Password!" });
            } else {
                const payload = {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
                const token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn: '48h' });
                return res.json({ message: "User logged in successfully!", user: user, token: token });
            
        }
    }).catch((error) => {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Server error" });
    });
}

// Get user
export function getUser(req, res) {
    if (!req.user) {
        return res.status(403).json({ message: "User not authenticated" });
    }
    res.status(200).json({ message: "User found", user: req.user });
}

// Get all users
export function getAllUsers(req, res) {
    User.find().then((users) => {
        res.json({ message: "Users fetched successfully!", users: users });
    }).catch((error) => {
        res.status(500).json({ message: "Error fetching users!", error: error.message });
    });
}

// Admin: Approve Organization
export async function approveOrganization(req, res) {
    const { userId } = req.params;

    try {
        if (req.user.role !== "superadmin" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin or Superadmin only." });
        }

        const user = await User.findById(userId);
        if (!user || user.role !== "organization") {
            return res.status(404).json({ message: "Organization not found" });
        }

        user.isApproved = true;
        await user.save();

        res.status(200).json({ message: "Organization approved successfully!", user });
    } catch (error) {
        console.error("Error during approval:", error);
        res.status(500).json({ message: "Error approving organization", error: error.message });
    }
}

// Delete user (Admin and Superadmin only)
export async function deleteUser(req, res) {
    const { userId } = req.params;

    try {
        if (req.user.role !== "superadmin" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin or Superadmin only." });
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully!" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
}

// Assign admin role (Superadmin only)
export async function assignAdmin(req, res) {
    const { userId } = req.params;
    const { role } = req.body;

    try {
        if (req.user.role !== "superadmin") {
            return res.status(403).json({ message: "Access denied. Superadmin only." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (role !== "admin" && role !== "volunteer") {
            return res.status(400).json({ message: "Invalid role assignment" });
        }

        user.role = role;
        await user.save();

        res.status(200).json({ message: `User role updated to ${role} successfully!`, user });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Error updating user role", error: error.message });
    }
}
