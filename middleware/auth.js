import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
	const token = req.headers.authorization;
	if (!token) return res.status(401).json({ message: "Unauthorized" });
	try {
		const bearerToken = token.split(" ")[1];
		const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: error.message });
	}
};

export default isAuth;
