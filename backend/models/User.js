const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {type: String, required: true,},
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    profile_picture: {type: String, required: false},
    role: {type: String, required: true},
    points: { type: Number, required: true,default: 0},
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
