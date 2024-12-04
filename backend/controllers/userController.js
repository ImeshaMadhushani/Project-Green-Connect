import User from '../models/User.js';


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
    } catch (err) { 
        res.status(500).json({ message: "Error creating user!", error: error.message });
    }
}
