import express from 'express';
import mongoose from 'mongoose';
//import Post from './models/Post.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();


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
