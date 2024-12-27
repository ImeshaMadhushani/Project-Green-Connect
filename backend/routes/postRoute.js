import { Router } from "express";

import multer from "multer";
import { createPost, deletePost, updatePost } from "../controllers/postController/postController";


const upload = multer({ dest: "uploads/" });
const router = Router();

router.post("/", upload.single("image"), createPost);
router.post("/:id/delete", deletePost);
router.post("/:id/update", upload.single("image"), updatePost);

export default router;
