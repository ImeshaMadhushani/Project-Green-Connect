import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    username: { type: String, required: true }, 
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now },
    approved: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

export default Feedback;