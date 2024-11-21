const express = require("express");
const mongoose = require("mongoose");
const Post = require('./models/Post');



const app = express();


//const port = 5000;
app.listen(port, () => {
    console.log("Backend is running on port", port);
});

//const mongourl='-------------';
mongoose.connect(mongourl).then(() => {
    console.log('MongoDB Connected');
}).catch((error) => {
    console.log(error);
});