import mongoose from "mongoose";

const { Schema } = mongoose;

const CommentSchema = new Schema({
  content: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    username: { type: String, required: true },
    image: { type: String },
    likes: { type: Number, default: 0 },

    shares: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    comments: [CommentSchema], 

  },
  { timestamps: true }
);

const Post = mongoose.model("Post", PostSchema);
export default Post;
