import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../helpers/winston.log.js";
export const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.headers.authorization && !req.cookies.accessToken) {
      logger.error("403 - No token, authorization denied");
      return res
        .status(403)
        .json({ message: "No token, authorization denied" });
    }
    let token = "";
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      if (!decoded) {
        logger.error("401 - Invalid token");
        return res.status(401).json({ message: "Invalid token" });
      }
      if (decoded.exp < Date.now().valueOf() / 1000) {
        logger.error("401 - Token expired");
        return res.status(401).json({ message: "Token expired" });
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        logger.error("404 - User not found");
        return res.status(404).json({ message: "User not found" });
      }
      if (user.role !== "admin") {
        logger.error("403 - You are not admin");
        return res.status(403).json({ message: "You are not admin" });
      }
      req.user = user;
      next();
    } else if (req.cookies?.accessToken) {
      token = req.cookies?.accessToken;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        if (!decoded) {
          logger.error("401 - Invalid token");
          return res.status(401).json({ message: "Invalid token" });
        }
        const user = await User.findById({ _id: decoded.id });
        if (!user) {
          logger.error("404 - User not found");
          return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "admin") {
          logger.error("403 - You are not admin");
          return res.status(403).json({ message: "You are not admin" });
        } else {
          req.user = user;
          next();
        }
      }
    }
  } catch (error) {
    console.log(error.message);
    return res.status(403).json({ EC: 1, EM: error.message, DT: "" });
  }
};
