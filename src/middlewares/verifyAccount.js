import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import logger from "../helpers/winston.log.js";
import Group from "../models/group.model.js";
const getinfobyId = async (arr) => {
  let list = [];
  if (arr && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      let user = await User.findById(
        arr[i],
        "_id name email gender is_online avatar phoneNumber"
      ).exec();
      list.push(user);
    }
  }
  return list;
};
const getinfoGroupbyId = async (arr) => {
  let list = [];
  if (arr && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      let user = await Group.findById(
        arr[i],
        "_id name members author avatar deputyLeader"
      )
        .populate("members", "_id name email avatar")
        .populate("author", "_id name email avatar")
        .exec();
      list.push(user);
    }
  }
  return list;
};
export const verifyAccount = async (req, res, next) => {
  try {
    if (!req.headers.authorization && !req.cookies.accessToken) {
      logger.error("403 - No token, authorization denied");
      return res
        .status(403)
        .json({ message: "No token, authorization denied" });
    }
    let token = "";
    let decoded;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Invalid token" });
      }
      try {
        decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      } catch (error) {
        logger.error("Invalid token");
        return res.status(401).json({ message: "Invalid token" });
      }
      if (decoded.exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({ message: "Token expired" });
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } else if (req.cookies?.accessToken) {
      token = req.cookies?.accessToken;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        console.log(decoded);
        let user = await User.findById({ _id: decoded.id });
        if (user) {
          let listfriend = await getinfobyId(user.friends);
          let listfriendRequests = await getinfobyId(user.friendRequests);
          let listsentFriendRequests = await getinfobyId(
            user.sentFriendRequests
          );
          let listgroup = await getinfoGroupbyId(user.groups);
          req.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            gender: user.gender,
            is_online: user.is_online,
            avatar: user.avatar,
            phoneNumber: user.phoneNumber,
            friends: listfriend,
            friendRequests: listfriendRequests,
            sentFriendRequests: listsentFriendRequests,
            groups: listgroup,
          };
          next();
        }
      }
    }
  } catch (error) {
    logger.error(`error in middleware verifyAccount ${error.message}`);
    return res.status(403).json({ EC: 1, EM: error.message, DT: "" });
  }
};
