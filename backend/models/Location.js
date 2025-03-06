import mongoose from "mongoose";

const { Schema } = mongoose;

const LocationSchema = new Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    locationName: { type: String, required: true },
    orgName: { type: String, required: true },
    projectName: { type: String, required: true },
});


const Post = mongoose.model("Location", LocationSchema);
export default Location;
