import Post from "../../models/Post.js";

export const likeController = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId); // Use req.params.postId
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const { username } = req.body; // Extract username from req.body
    if (!username) {
      return res.status(400).send("User not authenticated");
    }

    const hasLiked = post.likedBy.includes(username);

    if (hasLiked) {
      post.likes -= 1;
      post.points -= 2;
      post.likedBy = post.likedBy.filter((user) => user !== username);
    } else {
      post.likes += 1;
      post.points += 2;
      post.likedBy.push(username);
    }

    await post.save();
    res.status(200).json({ success: true, post }); // Return the updated post
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};