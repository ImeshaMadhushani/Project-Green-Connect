import Post from "../../models/Post.js";


export const addComment = async (req, res) => {
  const { content, username } = req.body; // Extract content and username from req.body

  if (!username) {
    return res.status(400).json({ success: false, message: "User not authenticated" });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Add the new comment
    const newComment = { content, username };
    post.comments.push(newComment);
    post.points += 5;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully!",
      comment: newComment, // Return the new comment
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check if the comment exists
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );
    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Remove the comment and decrement points
    post.comments.splice(commentIndex, 1);
    post.points -= 5;

    // Save the updated post
    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully!",
      post, // Return the updated post
    });
  } catch (err) {
    console.error(`Error deleting comment: ${err}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
};