import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar); // users to show on sidebar
router.get("/:id", protectRoute, getMessages);  // messages with particular user
router.post("/send/:id", protectRoute, sendMessage);

export default router;