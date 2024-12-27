import { Router } from "express";

import multer from "multer";
import { createPost, deletePost, updatePost } from "../controllers/postController/postController";
import { addComment, deleteComment } from "../controllers/postController/commentController";


const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/", upload.single("image"), createPost);
router.post("/:id/delete", deletePost);
router.post("/:id/update", upload.single("image"), updatePost);
router.post("/:id/comment", addComment);
router.post("/:postId/comment/:commentId/delete", deleteComment);

export default router;
