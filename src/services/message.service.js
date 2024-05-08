import Conversation from "../models/converstation.model.js";
import Message from "../models/message.model.js";

export const sendMessageService = async (
  receiverId,
  senderId,
  content,
  messageType
) => {
  try {
    // find conversation
    const conversation = await Conversation.findOne({
      participants: { $all: [receiverId, senderId] },
    });
    if (!conversation) {
      return {
        EC: 1,
        EM: "Conversation not found",
        DT: "",
      };
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      content,
      messageType,
    });
    await newMessage.save();
    const populatedMessage = await Message.findById(newMessage._id).populate(
      "senderId",
      "_id name avatar"
    );
    conversation.messages.push(newMessage._id);
    await conversation.save();
    return {
      EC: 0,
      EM: "Success",
      DT: populatedMessage,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Error",
      DT: error,
    };
  }
};

export const getMessagesService = async (senderId, receiverId, page = 1) => {
  try {
    const messages = await Message.find({
      $and: [
        {
          $or: [
            { senderId: senderId, receiverId: receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        { senderDelete: { $ne: senderId } },
      ],
    })
      .populate("senderId", "_id name avatar fileSize")
      .sort({ createdAt: -1 })
      .skip((page - 1) * 20)
      .limit(20);

    return {
      EC: 0,
      EM: "Success",
      DT: messages,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Error",
      DT: error,
    };
  }
};

export const deleteMessageService = async (messageId, senderID) => {
  try {
    const message = await Message.findByIdAndUpdate(messageId, {
      senderDelete: senderID,
    });
    if (!message) {
      return {
        EC: 1,
        EM: "Message not found",
        DT: "",
      };
    }
    return {
      EC: 0,
      EM: "Success",
      DT: message,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Error",
      DT: error,
    };
  }
};

export const recallMessageService = async (messageId) => {
  try {
    const messages = await Message.findByIdAndDelete(messageId);
    if (!messages) {
      return {
        EC: 1,
        EM: "Message not found",
        DT: "",
      };
    }
    // remove message from conversation
    const conversation = await Conversation.findOne({
      messages: { $in: [messageId] },
    });
    conversation.messages.pull(messageId);
    await conversation.save();
    return {
      EC: 0,
      EM: "Success",
      DT: messages,
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: "Error",
      DT: error,
    };
  }
};

export const sendMessageGroupService = async (
  senderId,
  groupId,
  content,
  messageType
) => {
  try {
    const newMessage = new Message({
      senderId,
      groupId,
      content,
      messageType,
    });
    await newMessage.save();
    const populatedMessage = await Message.findById(newMessage._id).populate(
      "senderId",
      "_id name avatar"
    );
    // find conversation
    const conversation = await Conversation.findOne({
      participantsGroup: { $all: [groupId] },
    });
    console.log("conversation::::", conversation);
    if (!conversation) {
      return {
        EC: 1,
        EM: "Conversation not found",
        DT: "",
      };
    }
    conversation.messages.push(newMessage._id);
    await conversation.save();
    return {
      EC: 0,
      EM: "Success",
      DT: populatedMessage,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Error",
      DT: error,
    };
  }
};

export const getMessagesGroupService = async (groupId, senderId) => {
  try {
    const messages = await Message.find({
      $and: [
        {
          groupId: groupId,
        },
        {
          senderDelete: { $ne: senderId },
        },
      ],
    }).populate("senderId", "_id name avatar");
    if (!messages) {
      return {
        EC: 1,
        EM: "Message not found",
        DT: "",
      };
    }
    return {
      EC: 0,
      EM: "Success",
      DT: messages,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Error",
      DT: error,
    };
  }
};

export const forwardMessageService = async (
  messageId,
  senderId,
  receiverId,
  groupId
) => {
  try {
    const message = await Message.findById(messageId);
    if (!message) {
      return {
        EC: 1,
        EM: "Message not found",
        DT: "",
      };
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      groupId, // add this line
      content: message.content,
      messageType: message.messageType,
    });
    await newMessage.save();
    const populatedMessage = await Message.findById(newMessage._id).populate(
      "senderId",
      "_id name avatar"
    );
    // if groupId exist
    if (groupId) {
      const conversation = await Conversation.findOne({
        participantsGroup: { $all: [groupId] },
      });
      if (!conversation) {
        return {
          EC: 1,
          EM: "Conversation not found",
          DT: "",
        };
      }
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
    // if receiverId exist
    if (receiverId) {
      const conversation = await Conversation.findOne({
        participants: { $all: [receiverId, senderId] },
      });
      if (!conversation) {
        return {
          EC: 1,
          EM: "Conversation not found",
          DT: "",
        };
      }
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
    return {
      EC: 0,
      EM: "Success",
      DT: populatedMessage,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: "Error",
      DT: error,
    };
  }
};
