import mongoose from "mongoose";
import User from "../models/User.js";
import organizationModel from "./organizationModel.js.js";

const ProjectSchema = mongoose.Schema(
    {
        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            validate: {
                validator: async function (value) {
                    const organization = await  organizationModel.findById(value);
                    return organization && organization.role === "organization";
                },
                message: "Only organizations can create projects"
            }
        },
        projectName: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        time: { type: String, required: true },
        location: { type: String, required: true },
        latitude: { type: Number, required: true },  // Added latitude field
        longitude: { type: Number, required: true }, // Added longitude field
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

        projectType: {
            type: String,
            enum: [
                "Waste Reduction",
                "Plantation",
                "Disaster Preparedness",
                "Environmental Awareness Campaigns",
                "Sustainable Gardening & Agriculture"
            ],
            required: true
        },
        noOfVolunteers: { type: Number, required: true },
        projectDuration: { type: String, required: true },
        volunteers: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },  // Volunteers field added
        qrCode: { type: String, required: true },
        attendance: [
            {
                volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                email: { type: String },
                isAttendance: { type: Boolean, default: false },
            }
        ]
        
    },
    { timestamps: true }
);

// Creating the model
const Project = mongoose.model("Project", ProjectSchema);

export default Project;
