import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  addConversation,
  createChat,
  deleteChat,
  getAllChats,
  getConversation,
} from "../controllers/chatControllers.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuth);

router.post("/new", createChat);
router.get("/all", getAllChats);
router.post("/:id", addConversation);
router.get("/:id", getConversation);
router.delete("/:id", deleteChat);

export default router;
