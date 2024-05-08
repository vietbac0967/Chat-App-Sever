import Conversation from "../models/converstation.model.js";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";
export const createGroupService = async (author, members, groupName) => {
  try {
    if (!groupName) {
      return {
        EC: 1,
        EM: "Group name is required",
        DT: "",
      };
    }
    // Check if the members list is empty
    console.log("Length of members:::", members.length);
    if (members.length < 2) {
      return {
        EC: 1,
        EM: "Group must have at least 3 members",
        DT: "",
      };
    }
    const user = await User.findById(author);
    const group = new Group({
      author,
      members,
      name: groupName,
      avatar: "https://avatar.iran.liara.run/public/job/astronomer/male",
    });

    // add the group to the user's groups
    user.groups.push(group._id);
    // push group to groups of all members
    members.forEach(async (member) => {
      const user = await User.findById(member);
      user.groups.push(group._id);
      await user.save();
    });

    // create conversation for group
    const conversation = new Conversation({
      participantsGroup: [group._id, ...members],
    });
    await group.save();
    await user.save();
    await conversation.save();
    return {
      EC: 0,
      EM: "Create group successfully",
      DT: group,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};

// Path: backend/src/controllers/group.controller.js
export const getGroupsForUserService = async (userId) => {
  try {
    const groups = await Group.find({
      $or: [{ author: userId }, { members: { $in: [userId] } }], // wrap userId in an array
    })
      .populate("author", "_id name email avatar")
      .populate("members", "_id name email");
    return {
      EC: 0,
      EM: "Success",
      DT: groups,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
// Path: backend/src/routes/group.controller.js
export const deteleGroupService = async (groupId) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return {
        EC: 1,
        EM: "Group not found",
        DT: "",
      };
    }
    const authorId = group.author;
    const deputyLeaderId = group.deputyLeader;
    const memberIds = group.members;

    await Promise.all([
      // Update author's groups
      User.updateOne({ _id: authorId }, { $pull: { groups: groupId } }),
      // If deputyLeader exists, update their groups
      deputyLeaderId &&
        User.updateOne({ _id: deputyLeaderId }, { $pull: { groups: groupId } }),
      // Update groups for all members
      User.updateMany(
        { _id: { $in: memberIds } },
        { $pull: { groups: groupId } }
      ),
      // Delete the group
      Group.deleteOne({ _id: groupId }),
    ]);
    await Conversation.deleteOne({ participantsGroup: [groupId] });
    return {
      EC: 0,
      EM: "Success",
      DT: "",
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
// Path: backend/src/controllers/group.controller.js
export const addMemberToGroupService = async (groupId, members) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return {
        EC: 1,
        EM: "Group not found",
        DT: "",
      };
    }
    group.members.push(members);
    // push group to groups of all members
    members.forEach(async (member) => {
      const user = await User.findById(member);
      user.groups.push(group._id);
      await user.save();
    });
    await group.save();
    return {
      EC: 0,
      EM: "Success",
      DT: group,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
// Path: backend/src/routes/group.controller.js
export const deleteMemberFromGroupService = async (groupId, userId) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return {
        EC: 1,
        EM: "User is not authorized to delete member",
        DT: "",
      };
    }
    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );
    if (group.deputyLeader && group.deputyLeader.toString() === userId) {
      group.deputyLeader = null;
    }
    const user = await User.findById(userId);
    user.groups = user.groups.filter((group) => group.toString() !== groupId);
    await user.save();
    await group.save();
    return {
      EC: 0,
      EM: "Success",
      DT: group,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
// Path: backend/src/controllers/group.controller.js
export const updateNameGroupService = async (groupId, name) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return {
        EC: 1,
        EM: "Group not found",
        DT: "",
      };
    }
    group.name = name;
    await group.save();
    return {
      EC: 0,
      EM: "Success",
      DT: group,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
// Path: backend/src/routes/group.controller.js
export const leaveGroupService = async (userId, groupId) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return {
        EC: 1,
        EM: "Not found group",
        DT: "",
      };
    }
    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );
    if (group.deputyLeader.toString() === userId) {
      group.deputyLeader = "";
    }
    const user = await User.findById(userId);
    user.groups = user.groups.filter((group) => group.toString() !== groupId);
    await user.save();
    await group.save();
    return {
      EC: 0,
      EM: "Success",
      DT: group,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
// Path: backend/src/controllers/group.controller.js
export const getUserForGroupService = async (groupId) => {
  try {
    const populatedGroup = await Group.findById(groupId).populate([
      { path: "author", select: "_id name email avatar" },
      { path: "members", select: "_id name email avatar" },
    ]);

    if (!populatedGroup) {
      return {
        EC: 1,
        EM: "Group not found",
        DT: "",
      };
    }
    const author = populatedGroup.author;
    let members = populatedGroup.members;
    // add author to front members list
    members = [author, ...members];
    return {
      EC: 0,
      EM: "Success",
      DT: members,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
// Path: backend/src/routes/group.controller.js
export const getLeadForGroupService = async (groupId) => {
  try {
    // check userId is author or deputyLeader
    const group = await Group.findById(groupId).populate([
      { path: "author", select: "_id name email avatar" },
      { path: "deputyLeader", select: "_id name email avatar" },
    ]);
    if (!group) {
      return {
        EC: 1,
        EM: "Group not found",
        DT: "",
      };
    }
    return {
      EC: 0,
      EM: "Success",
      DT: {
        author: group.author,
        deputyLeader: group.deputyLeader,
      },
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
// Path: backend/src/controllers/group.controller.js
export const updateDeputyLeaderService = async (groupId, userId) => {
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return {
        EC: 1,
        EM: "Group not found",
        DT: "",
      };
    }
    group.deputyLeader = userId;
    await group.save();
    return {
      EC: 0,
      EM: "Success",
      DT: group,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
// Path: backend/src/routes/group.controller.js
export const getGroupByIdService = async (groupId) => {
  try {
    const group = await Group.findById(groupId).populate(
      "author",
      "_id name email avatar"
    );
    if (!group) {
      return {
        EC: 1,
        EM: "Group not found",
        DT: "",
      };
    }

    return {
      EC: 0,
      EM: "Success",
      DT: group,
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
