const express = require("express");
const mongoose = require("mongoose");
const Post = require('./models/Post');
const Post = require('./models/User');
const multer = require('multer');


const app = express();


//const port = 5000;
//const mongourl='mongodb://localhost:0000/';


app.listen(port, () => {
    console.log("Backend is running on port", port);
});


mongoose.connect(mongourl).then(() => {
    console.log('MongoDB Connected');
}).catch((error) => {
    console.log(error);
});