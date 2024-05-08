import { Types } from "mongoose";
import logger from "../helpers/winston.log.js";
import Conversation from "../models/converstation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllUserService = async (admin) => {
  try {
    const users = await User.find({ _id: { $ne: admin } }).select(
      "_id name avart phoneNumber"
    );
    return {
      EC: 0,
      EM: "Success",
      DT: users,
    };
  } catch (error) {
    logger.error(error.message);
    return {
      EC: 1,
      EM: error.message,
      DT: error,
    };
  }
};
export const getNumberOfSendMessaagesService = async (userId) => {
  try {
    const messages = await Message.find({ senderId: userId });
    return {
      EC: 0,
      EM: "Success",
      DT: messages.length,
    };
  } catch (error) {
    logger.error(error.message);
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
export const getNumberOfSendImageService = async (userId) => {
  try {
    const messages = await Message.find({
      senderId: userId,
      messageType: "image",
    });
    return {
      EC: 0,
      EM: "Success",
      DT: messages.length,
    };
  } catch (error) {
    logger.error(error.message);
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};

export const getFriendsFollowMonthAndYearService = async (
  userId,
  month,
  year
) => {
  try {
    // Convert month to zero-indexed
    month = month - 1;

    const startDate = new Date(year, month);
    const endDate = new Date(year, month + 1);

    const friends = await Conversation.find({
      participants: { $in: [userId] },
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    }).populate("participants", "_id name avatar");

    return {
      EC: 0,
      EM: "Success",
      DT: friends,
    };
  } catch (error) {
    logger.error(error.message);
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};

export const getNewRegisterUsersService = async (month, year) => {
  try {
    month = month - 1;
    const startDate = new Date(year, month);
    const endDate = new Date(year, month + 1);
    const users = await User.find({
      createdAt: {
        $gte: startDate,
        $lt: endDate,
      },
    }).select("_id name avatar");
    return {
      EC: 0,
      EM: "Success",
      DT: users,
    };
  } catch (error) {
    logger.error(error.message);
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};

export const getTotalDataSizeOfUserService = async (userId) => {
  try {
    // Use aggregate to calculate the total data size of messages sent by the user
    const totalDataSize = await Message.aggregate([
      {
        $match: {
          senderId: new Types.ObjectId(userId),
          messageType: { $in: ["image", "file"] },
          fileSize: { $ne: null },
        },
      },
      {
        $group: {
          _id: null,
          totalSize: {
            $sum: "$fileSize",
          },
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field from the output
          totalSize: 1, // Include totalSize field in the output
        },
      },
    ]);

    // Return the result
    return {
      EC: 0, // Error code 0 indicates success
      EM: "Success", // Success message
      DT: totalDataSize.length > 0 ? totalDataSize[0].totalSize : 0, // Total data size (if available)
    };
  } catch (error) {
    // If there's an error, return error details
    return {
      EC: 1, // Error code 1 indicates an error
      EM: error.message, // Error message
      DT: "", // No data to return in case of error
    };
  }
};
