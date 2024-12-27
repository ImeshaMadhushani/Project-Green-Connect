import Post from "../../models/Post";

export const likeController = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // const username = req.session.username; 
    const username = req.body;
    if (!username) {
      return res.status(400).send("User not authenticated");
    }

    const hasLiked = post.likedBy.includes(username);

    if (hasLiked) {

      post.likes -= 1;
      post.points -= 2; 
      post.likedBy = post.likedBy.filter((user) => user !== username); 
      await post.save();
      return res.send("Dislike successful and points updated");
    } else {
  
      post.likes += 1;
      post.points += 2; 
      post.likedBy.push(username);
      await post.save();
      return res.send("Like added and points updated");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
