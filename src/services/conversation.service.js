import Conversation from "../models/converstation.model.js";
import User from "../models/user.model.js";

// export const getConverstationService = async (userId) => {
//   try {
//     const user = await User.findById(userId);
//     const groupIds = user.groups; // assuming 'groups' is an array of group IDs
//     const conversation = await Conversation.find({
//       $or: [
//         { participants: { $in: [userId] } },
//         { participantsGroup: { $in: groupIds } },
//       ],
//     })
//       .populate([
//         {
//           path: "participants",
//           select: "avatar _id name",
//         },
//         {
//           path: "participantsGroup",
//           select: "avatar _id name members",
//         },
//         {
//           path: "messages",
//           select: "content createdAt messageType",
//         },
//       ])
//       .sort({ updatedAt: -1 });

//     let result = [];
//     conversation.forEach((item) => {
//       if (item.participantsGroup.length > 0) {
//         result.push({
//           _id: item.participantsGroup[0],
//           name: item.participantsGroup[0]?.name,
//           // avatar is avatar of useId another current user
//           avatar: item.participantsGroup[0]?.avatar,
//           type: "group",
//           message: item.messages[item.messages.length - 1]?.content || "",
//           messageType:
//             item.messages[item.messages.length - 1]?.messageType || "",
//         });
//       }
//       if (item.participants.length > 0) {
//         result.push({
//           _id: item.participants.filter(
//             (item) => item._id != userId.toString()
//           )[0]._id,
//           name: item.participants.filter(
//             (item) => item._id != userId.toString()
//           )[0].name,
//           avatar: item.participants.filter(
//             (item) => item._id != userId.toString()
//           )[0].avatar,
//           type: "private",
//           message: item?.messages[item.messages.length - 1]?.content || "",
//           messageType:
//             item?.messages[item.messages.length - 1]?.messageType || "",
//         });
//       }
//     });
//     return {
//       EC: 0,
//       EM: "Success",
//       DT: result,
//     };
//   } catch (error) {
//     return {
//       EC: 1,
//       EM: error.message,
//       DT: "",
//     };
//   }
// };
export const getConversationService = async (userId) => {
  try {
    const user = await User.findById(userId);
    const groupIds = user.groups; // assuming 'groups' is an array of group IDs

    const conversations = await Conversation.find({
      $or: [
        { participants: { $in: [userId] } },
        { participantsGroup: { $in: groupIds } },
      ],
    })
      .populate([
        {
          path: "participants",
          select: "avatar _id name phoneNumber",
        },
        {
          path: "participantsGroup",
          select: "avatar _id name members",
        },
        {
          path: "messages",
          select: "content createdAt messageType receiverId senderId",
        },
      ])
      .sort({ updatedAt: -1 });

    const result = conversations.map((conversation) => {
      let participants = null;
      let type = "private";

      if (conversation.participantsGroup.length > 0) {
        participants = {
          _id: conversation.participantsGroup[0],
          name: conversation.participantsGroup[0].name,
          avatar: conversation.participantsGroup[0].avatar,
        };
        type = "group";
      } else if (conversation.participants.length > 0) {
        participants = conversation.participants.find(
          (participant) => participant._id.toString() !== userId.toString()
        );
      }
      return {
        _id: type === "group" ? participants._id : participants._id,
        name: participants ? participants.name : null,
        avatar: participants ? participants.avatar : null,
        members: conversation.participantsGroup[0]?.members || [],
        type,
        phoneNumber: participants ? participants.phoneNumber : null,
        message: conversation.messages[conversation.messages.length - 1] || "",
        messageType:
          conversation.messages[conversation.messages.length - 1]
            ?.messageType || "",
      };
    });

    return {
      EC: 0,
      EM: "Success",
      DT: result,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
export const getConversationForwardsService = async (userId, messageId) => {
  try {
    const user = await User.findById(userId);
    const groupIds = user.groups; // assuming 'groups' is an array of group IDs
    const conversations = await Conversation.find({
      $and: [
        {
          $or: [
            { participants: { $in: [userId] } },
            { participantsGroup: { $in: groupIds } },
          ],
        },
        { messages: { $nin: [messageId] } },
      ],
    })
      .populate([
        {
          path: "participants",
          select: "avatar _id name",
        },
        {
          path: "participantsGroup",
          select: "avatar _id name members author",
        },
        {
          path: "messages",
          select: "content createdAt messageType",
        },
      ])
      .sort({ updatedAt: -1 });

    const result = conversations.map((conversation) => {
      let participants = null;
      let type = "private";

      if (conversation.participantsGroup.length > 0) {
        participants = {
          _id: conversation.participantsGroup[0],
          name: conversation.participantsGroup[0].name,
          avatar: conversation.participantsGroup[0].avatar,
        };
        type = "group";
      } else if (conversation.participants.length > 0) {
        participants = conversation.participants.find(
          (participant) => participant._id.toString() !== userId.toString()
        );
      }

      return {
        _id: type === "group" ? participants._id : participants._id,
        name: participants ? participants.name : null,
        avatar: participants ? participants.avatar : null,
        type,
        message:
          conversation.messages[conversation.messages.length - 1]?.content ||
          "",
        messageType:
          conversation.messages[conversation.messages.length - 1]
            ?.messageType || "",
      };
    });

    return {
      EC: 0,
      EM: "Success",
      DT: result,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
