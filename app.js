import express from "express";
import dbConnect from "./utils/dbConnect.js";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";
import userRouter from "./route/user.js";
import postRouter from "./route/post.js";
config();
const port = process.env.PORT || 9000;

dbConnect();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.listen(port, () => console.log(`Server running on port ${port}`));
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
