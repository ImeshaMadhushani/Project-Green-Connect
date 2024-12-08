import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile_picture: { type: String },
    role: { type: String, required: true },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
