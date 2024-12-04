import mongoose from "mongoose";
//const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema(
  {
    name: {type: String, required: true,},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profile_picture: {type: String, required: false},
    role: {type: String, required: true}
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
