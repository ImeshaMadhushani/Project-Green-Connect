import express from "express";
import multer from "multer";
import path from 'path';

import { createPost, deletePost, updatePost, } from "../controllers/postController/postController.js";
import { addComment, deleteComment } from "../controllers/postController/commentController.js";
import { likeController, toggleLike } from "../controllers/postController/likeController.js";
import { getLeaderboard } from "../controllers/postController/leaderboardController.js";


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
  dest: "uploads/"
});

// Routes
router.post("/", upload.single("image"), createPost);
router.delete("/:id/delete", deletePost);
router.post("/:id/update", upload.single("image"), updatePost);
router.post("/:id/comment", addComment);
router.delete("/:postId/comment/:commentId/delete", deleteComment);
router.post("/:postId/like", likeController);
router.get('/leaderboard',getLeaderboard);


export default router;
