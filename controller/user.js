import user from "../model/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const getUser = async (req, res) => {
	try {
		const id = req.query?.id
		const data = await user.findById(id).select(['userName', 'imageUrl']);
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
}
const signup = async (req, res) => {
	const { userName, email, password } = req.body;
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(password, salt);
	try {
		const data = await user.findOne({ email });
		if (data) {
			return res.status(400).json({ message: "User already exists" });
		}
		const newUser = new user({
			userName,
			email,
			password: hashPassword,
		});
		await newUser.save();
		const tokenData = {
			id: newUser._id,
			userName: newUser.userName,
			email: newUser.email,
		};
		const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
			expiresIn: "30d",
		});
		res.status(200).json({ userId: newUser._id, userName, access_token: token });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const data = await user.findOne({ email });
		if (!data) {
			return res.status(404).json({ message: "User not found" });
		}
		const isMatch = bcrypt.compareSync(password, data.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Password is incorrect" });
		}
		const tokenData = {
			userId: data._id,
			userName: data.userName,
			email: data.email,
		};
		const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
			expiresIn: "30d",
		});
		res.status(200).json({ userId: data._id, email, access_token: token });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

const addPhoto = async (req, res) => {
	try {
		const userId = req.userId;
		const data = await user.findById(userId);
		data.imageUrl = req.file.location;
		await data.save();
		console.log(data);
		res.status(200).json({ message: 'Photo updated' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
}

export { signup, login, addPhoto, getUser };
