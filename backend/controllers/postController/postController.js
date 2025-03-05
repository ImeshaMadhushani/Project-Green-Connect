import Post from "../../models/Post.js";
import path from "path";
import fs from "fs";
import User from "../../models/User.js";

export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      username
    } = req.body;
    const imagePath = req.file ? `uploads/${req.file.filename}` : null; // Save file path

    if (!title || !content || !username) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "User not found",
      });
    }

    const post = new Post({
      title,
      content,
      username,
      image: imagePath,
    });

    await post.save();

    res.status(200).send({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};


export const getPost = async(req,res)=>{
  try {
    const post  = await Post.find({});
   
    if(!post){
      return res.status(404).send({
        success: false,
        message: "No posts found",
      })
    }else{
      res.status(200).send({
        success: true,
        message: "Posts fetched successfully",
        posts: post,
      })
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Server Error",
    })
  }
}

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Post deleted successfully",
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const updatePost = async (req, res) => {
  try {
    const {
      title,
      content
    } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).send({
        success: false,
        message: "Post not found",
      });
    }

    post.title = title;
    post.content = content;

    if (req.file) {
      console.log(req.file.filename);
      const newImagePath = `uploads/${req.file.filename}`;

      if (post.image) {
        const oldImagePath = path.join(process.cwd(), post.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          ds;
        }
      }

      post.image = newImagePath;
    }

    await post.save();
    res.status(200).send({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Server Error",
    });
  }
};