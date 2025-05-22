import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: "No token provided. Please login first.",
      });
    }

    const token = authHeader.split(' ')[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    if (!decode || !decode._id) {
      return res.status(401).json({
        message: "Invalid token. Please login again.",
      });
    }

    const user = await User.findById(decode._id);
    
    if (!user) {
      return res.status(401).json({
        message: "User not found. Please login again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        message: "Invalid token. Please login again.",
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        message: "Token expired. Please login again.",
      });
    }
    res.status(500).json({
      message: "Authentication failed. Please try again.",
    });
  }
};
