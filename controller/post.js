import Post from "../model/post.js";
import getItemEndpint from "../utils/generateEndpoint.js";

const createPost = async (req, res) => {
	const { title, content } = req.body;
	try {
		const newPost = new Post({
			title,
			content,
			createdBy: req.userId,
			endpoint: await getItemEndpint(title),
		});
		await newPost.save();
		res.status(200).json({ message: "Post created successfully" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const getPosts = async (req, res) => {
	try {
		const { limit = 25, offset = 0, search, userId } = req.query;
		const query = {}
		if (search) query.title = { $regex: search, $options: 'i' }
		if (userId) query.createdBy = userId;
		const posts = await Post.find(query).select("-__v").sort('-createdAt').limit(limit).skip(offset).populate("createdBy", ["userName", "imageUrl"]).populate("comment.createdBy", "userName");
		const hasmore = await Post.countDocuments(query) > parseInt(offset) + parseInt(limit);
		res.status(200).json({ data: posts, count: posts.length, limit, offset, hasmore });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getPost = async (req, res) => {
	const { postName } = req.params;
	try {
		const post = await Post.findOne({ endpoint: postName }).select('-__v');
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updatePost = async (req, res) => {
	const { id, title, content } = req.body;
	try {
		const data = await Post.findOneAndUpdate(id, { title, content }, { new: true });
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const deletePost = async (req, res) => {
	const { id } = req.params;
	try {
		await Post.findByIdAndDelete(id);
		res.status(200).json({ message: "Delete successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const likePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const userId = req.userId;
		const data = await Post.findById(postId);
		if (data.like.includes(userId)) {
			data.like = data.like.filter((id) => id != userId);
		} else {
			data.like.push(userId);
		}
		await data.save();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const comment = async (req, res) => {
	try {
		const { postId, content } = req.body;
		const userId = req.userId;
		console.log(postId, content, userId);
		const data = await Post.findById(postId);
		console.log(data);
		data.comment = [...data.comment, { content, createdBy: userId, createdAt: new Date() }];
		await data.save();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const deleteComment = async (req, res) => {
	try {
		const userId = req.userId;
		const { postId, commentId } = req.body;
		console.log('here');
		const post = await Post.findById(postId);
		console.log('here2');
		const comment = post.comment.find((comment) => comment._id == commentId);
		if (!comment) {
			return res.status(404).json({ message: "Comment not found" })
		}
		if (post.createdBy == userId || comment.createdBy == userId) {
			post.comment = post.comment.filter((comment) => comment._id != commentId);
			await post.save();
			res.status(200).json(post);
		} else {
			res.status(401).json({ message: "You are not authorized to delete this comment" })
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
}

export { createPost, getPosts, getPost, updatePost, deletePost, likePost, comment, deleteComment };
