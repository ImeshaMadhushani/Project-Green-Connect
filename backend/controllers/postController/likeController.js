import Post from "../../models/Post.js";

// likeController.js
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    const username = req.body;
    if (!username) {
      return res.status(400).send("User not authenticated");
    }

    const hasLiked = post.likedBy.includes(username);

    if (hasLiked) {
      // Dislike the post
      post.likes -= 1;
      post.points -= 2; 
      post.likedBy = post.likedBy.filter((user) => user !== username); 
    } else {
      // Like the post
      post.likes += 1;
      post.points += 2; 
      post.likedBy.push(username);
    }

    await post.save();
    res.send(hasLiked ? "Dislike successful and points updated" : "Like added and points updated");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
