import Post from "../models/Post.js";
import path from "path";
import fs from "fs";

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const username = req.session.username;

    if (!username) {
      return res.status(400).send("User not authenticated");
    }

    const post = new Post({
      title,
      content,
      username,
      image: req.file ? req.file.filename : undefined,
    });

    await post.save();
    res.redirect("/home");
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.redirect("/account");
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// Update a post
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
    res.redirect("/home");
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

//update exsisted post
export const updateExPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.render("create", { isUpdate: true, post, username: req.session.username });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const username = req.session.username;

    if (!username) {
      return res.status(400).send("User not authenticated");
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    post.comments.push({ content, username });
    await post.save();
    res.redirect(`/home`);
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    if (!post) {
      return res.status(404).send("Post not found");
    }

    res.redirect("/home");
  } catch (error) {
    res.status(500).send("Server Error");
  }
};

// Like or unlike a post
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.postId;
    const username = req.session.username;

    if (!username) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const post = await Post.findById(postId);

    if (post) {
      const hasLiked = post.likedBy.includes(username);

      if (hasLiked) {
        post.likes -= 1;
        post.likedBy = post.likedBy.filter((user) => user !== username);
      } else {
        post.likes += 1;
        post.likedBy.push(username);
      }

      await post.save();
      res.json({ likes: post.likes, liked: !hasLiked });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
