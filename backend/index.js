import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import userRouter from './routes/userRoute.js';
import projectRouter from './routes/projectRoute.js';

import postRoute from './routes/postRoute.js';

import cors from 'cors'; 


import methodOverride from 'method-override';
import  path  from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';




dotenv.config();
const app = express();

app.use(cors()); 
app.use(methodOverride('_method'));
app.use(morgan("dev"));
app.use(session({
    secret: 'yourSecretKey', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
  }));

  
  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//Middleware to verify JWT

app.use((req, res, next) => {
    const token = req.headers['authorization']?.replace('Bearer', "").trim();
    
    if (token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    console.warn("Token has expired:", err.expiredAt);
                    return res.status(401).json({
                        message: "Session expired.Please log in again.",
                        error: err.message,
                    });
                }
                console.error("Token verification error:", err);
                return res.status(401).json({ message: "Invalid token,Please log in again.", error: err.message })
            }
    
            req.user = decoded;

            next();
        });
    } else {
        next();
    }
});


app.use("/api/user", userRouter);
app.use("/api/project", projectRouter);
app.use('/api/post', postRoute)



// Connect to MongoDB

const connectionString = process.env.MONGO_URL

mongoose.connect(connectionString).then(
    () => {
        console.log('Connected to MongoDB');
    }
).catch(
    (error) => {
        console.error('Failed to connect to MongoDB', error);
    }
)

app.listen(5000, () => {
    console.log("Backend is running on port", 5000);
});
