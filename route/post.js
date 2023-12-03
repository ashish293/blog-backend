import { Router } from "express";
import {
	createPost,
	getPosts,
	getPost,
	updatePost,
	deletePost,
	likePost,
	comment,
	deleteComment,
} from "../controller/post.js";
import auth from "../middleware/auth.js";

const router = Router();

router
	.get("/", getPosts)
	.post("/", auth, createPost)
	.get("/:postName", getPost)
	.patch("/update", auth, updatePost)
	.delete("/delete/:id", auth, deletePost)
	.patch("/like/:postId", auth, likePost)
	.patch("/comment", auth, comment)
	.delete("/deleteComment", auth, deleteComment);

export default router;
