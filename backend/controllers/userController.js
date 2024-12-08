import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//import dotenv from 'dotenv';


// Register a new user
export async function register(req, res) {
    const { name, username, email, password, profile_picture, role } = req.body;
    const saltRound = 10;

    try {
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = bcrypt.hashSync(password, saltRound);

        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
            profile_picture,
            role
        });

        await newUser.save()
        console.log("Recieved new user : ", req.body);
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) { 
        res.status(500).json({ message: "Error creating user!", error: error.message });
    }
}

// Login

export function login(req, res) {
    const credentials = req.body;

    User.findOne({ username: credentials.username }).then((user) => {
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        } else {
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



