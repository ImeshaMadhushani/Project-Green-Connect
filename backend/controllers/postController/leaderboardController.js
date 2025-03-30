import Post from "../../models/Post.js"; // Adjust path as needed
import User from "../../models/User.js"; // Adjust path as needed

export const getLeaderboard = async (req, res) => {
  try {
    // Aggregate points by username from Post model
    const leaderboard = await Post.aggregate([
      {
        $group: {
          _id: "$username",
          points: { $sum: "$points" },
        },
      },
      {
        $sort: { points: -1 },
      },
    ]);

    // Fetch user details including profile_picture
    const usersWithPhotos = await Promise.all(
      leaderboard.map(async (entry) => {
        const user = await User.findOne({ username: entry._id }).select("username profile_picture");
        return {
          username: entry._id,
          points: entry.points,
          profilePhoto: user?.profile_picture || null, // Map to profilePhoto for frontend consistency
        };
      })
    );

    res.status(200).json({
      success: true,
      users: usersWithPhotos,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getTopPosts = async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    
    const topPosts = await Post.find()
      .sort({ points: -1, createdAt: -1 }) // Sort by points then by recency
      .limit(parseInt(limit))
      .select('title image username content category likes points') // Select only needed fields
      .exec();

    res.status(200).json({
      success: true,
      posts: topPosts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};