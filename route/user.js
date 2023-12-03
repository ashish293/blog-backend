import { signup, login, addPhoto, getUser } from "../controller/user.js";
import { Router } from "express";
import isAuth from "../middleware/auth.js";
import upload from "../middleware/fileUpload.js";

const router = Router();

router.post("/signup", signup).post('/login', login).post('/addPhoto', [isAuth, upload.single('photo')], addPhoto).get('/getUser', isAuth, getUser);
export default router;