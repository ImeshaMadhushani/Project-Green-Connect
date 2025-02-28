import Post from "../../models/Post.js";
import path from "path";
import fs from "fs";
import User from "../../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, username } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null; // Save file path

    if (!title || !content || !username) {
      return res.status(400).send("All fields are required");
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send("User not found");
    }

    const post = new Post({
      title,
      content,
      username,
      image: imagePath,
    });

    await post.save();

    res.status(200).send({
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.status(200).send({
        message: "Post deleted successfully",
        post,
      
    })
    // res.redirect("/account");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, removeImage } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send("Post not found");
    }

    post.title = title;
    post.content = content;

    if (removeImage === "true" && post.image) {
      const oldImagePath = path.join("uploads", post.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      post.image = undefined;
    }

    if (req.file) {
      if (post.image) {
        const oldImagePath = path.join("uploads", post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      post.image = req.file.filename;
    }

    await post.save();
    res.status(200).send({
        message: "Post updated successfully",
        post,
      });
    // res.redirect("/home");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};
