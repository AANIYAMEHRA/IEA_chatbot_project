import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    latestMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Chat = mongoose.model("Chat", schema);
