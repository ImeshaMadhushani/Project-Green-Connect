import mongoose from "mongoose";
import User from "../models/User.js";

const LocationSchema = mongoose.Schema({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    locationName: { type: String, required: true },
});

const ProjectSchema = mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            validate: {
                validator: async function (value) {
                    const organization = await User.findById(value);
                    return organization && organization.role === "organization";
                },
                message: "Only organizations can create projects"
            }
        },
        projectName: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        //updated loacation  with cordinates
        location: [LocationSchema],
        status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
        isApproved: { type: Boolean, default: false },
        approveDate: { type: Date, default: null },
        endDate: {
            type: Date,
            required: function () { return this.isApproved; },
            default: function () {
                if (this.approveDate) {
                    const endDate = new Date(this.approveDate);
                    endDate.setDate(endDate.getDate() + 14); // Adds 14 days after approval
                    return endDate;
                }
                return null;
            }
        },
    },
    { timestamps: true }
);



// Creating the model
const Project = mongoose.model("Project", ProjectSchema);

export default Project;
