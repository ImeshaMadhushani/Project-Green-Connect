import Post from "../models/Post.js";

export const addComment = async (req, res) => {
  const { content,username } = req.body;
//   const username = req.session.username;

  if (!username) {
    return res.status(400).send("User not authenticated");
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }
    post.comments.push({ content, username });
    post.points += 5; 
    await post.save();
    res.status(200).send({
        message: "Comment added successfully!",
        post,
    })
    // res.redirect(`/home`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } }, $inc: { points: -5 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).send("Post not found");
    }
    res.status(200).send({ message: "Comment deleted successfully!", post });

    // res.redirect("/home");
  } catch (err) {
    console.error(`Error deleting comment: ${err}`);
    res.status(500).send("Server error");
  }
};
