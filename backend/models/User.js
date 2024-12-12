
import mongoose from 'mongoose';
const { Schema } = mongoose;

const UserSchema = mongoose.Schema(
  {
    name: {type: String, required: true,},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profile_picture: {type: String, required: false},
    role: { type: String, required: true, enum: ["volunteer", "organization", "admin"] },
    registrationNumber: {type: String,required: function () { return this.role === "organization"; },unique: true},
    registrationDate: {type: Date,required: function () { return this.role === "organization"; }},
    isApproved: { type: Boolean, required: function () { return this.role === "organization"; }, default: false },
    legalDocument: { type: String, required: function () { return this.role === "organization"; } },
    
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
