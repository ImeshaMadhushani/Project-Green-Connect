import Post from "../../models/Post.js";

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Post.aggregate([
      {
        $group: {
          _id: "$username",
          totalPoints: { $sum: "$points" }, 
        },
      },
      {
        $sort: { totalPoints: -1 },
      },
      {
        $project: {
          _id: 0,
          username: "$_id", 
          totalPoints: 1, 
        },
      },
    ]);

    res.status(200).send({
        leaderboard});
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
