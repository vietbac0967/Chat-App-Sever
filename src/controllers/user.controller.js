import {
  acceptFriendRequestToUser,
  findUserByPhone,
  getFriendsNotInGroupService,
  getUserByIdService,
  getUserInfoService,
  rejectFriendRequestToUser,
  sendFriendRequestToUser,
  showFriendRequests,
  showFriends,
  showSentFriendRequests,
  updateUserInfoService,
  updateUserImageService,
  deleteFriendService,
} from "../services/user.service.js";
import cloud from "../utils/cloudinary.js";
export const getUser = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({
        EC: 1,
        EM: "userId query parameter is required",
        DT: "",
      });
    }
    const user = await getUserByIdService(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to get user info
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await getUserInfoService(userId);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to get user by phone
export const getUserByPhone = async (req, res) => {
  try {
    const { phone } = req.body;
    const senderId = req.user._id;
    const user = await findUserByPhone(phone, senderId);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to send friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const sender = req.user._id;
    const receiver = req.body.receiver;
    const result = await sendFriendRequestToUser(sender, receiver);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to get friend requests
export const getFriendRequests = async (req, res) => {
  try {
    const user = req.user;
    const friendRequests = await showFriendRequests(user._id);
    res.status(200).json(friendRequests);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.user._id;
    const result = await acceptFriendRequestToUser(senderId, receiverId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to reject a friend request
export const rejectFriendRequest = async (req, res) => {
  try {
    const senderId = req.body.senderId;
    const receiverId = req.user._id;
    const result = await rejectFriendRequestToUser(senderId, receiverId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to delete a friend
export const deleteFriend = async (req,res) => {
  try {
    const userId = req.user._id;
    const friendId = req.body.friendId;
    const result = await deleteFriendService(userId, friendId);
    res.status(200).json(result);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to get friends
export const getFriends = async (req, res) => {
  try {
    const user = req.user;
    console.log("UserID:::::", user._id);
    const friends = await showFriends(user._id);
    res.status(200).json(friends);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to get sent friend requests
export const getSentFriendRequests = async (req, res) => {
  try {
    const user = req.user;
    const sentFriendRequests = await showSentFriendRequests(user._id);
    res.status(200).json(sentFriendRequests);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const updatedUserInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedUser = await updateUserInfoService(userId, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: "Error updating user info",
      DT: "",
    });
  }
};

// endpoint to update user image
export const updateUserImage = async (req, res) => {
  try {
    const userId = req.user._id;

    cloud.uploader.upload_stream({ resource_type: "auto" }, async (error, result) => {
      if (error) {
        res.status(500).json({ EC: 1, EM: "Error", DT: "" });
      } else {
        const imageUrl = result.secure_url;
        const result1 = await updateUserImageService(userId, imageUrl);
        res.status(200).json(result1);
      }
    }).end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ EC: 1, EM: error.message, DT: "" });
  }
};
// endpoint to get friends not in a group
export const getFriendsInNotGroup = async (req, res) => {
  try {
    const groupId = req.query.groupId;
    const userId = req.user._id;
    const users = await getFriendsNotInGroupService(userId, groupId);
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
