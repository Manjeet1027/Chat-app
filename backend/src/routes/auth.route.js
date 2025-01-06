import express from  "express";
import {signup, login, logout, updateProfile, checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);   // update only if they have token/authenticated

router.get("/check", protectRoute, checkAuth);    // will help when page refreshes that the user is authenticated or not

export default router;