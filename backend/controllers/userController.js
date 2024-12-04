import User from '../models/User';

// Register a new user
export async function register(req, res) {
    const { name, username, email, password, profile_picture, role } = req.body;
}