import Group from "../models/group.model.js";
import {
  addMemberToGroupService,
  createGroupService,
  deleteMemberFromGroupService,
  deteleGroupService,
  getGroupByIdService,
  getGroupsForUserService,
  getLeadForGroupService,
  getUserForGroupService,
  leaveGroupService,
  updateDeputyLeaderService,
  updateNameGroupService,
} from "../services/group.service.js";
import cloud from "../utils/cloudinary.js";

export const createGroup = async (req, res) => {
  try {
    const author = req.user._id;
    const { groupName, members } = req.body;
    // Check if the group name is empty
    const response = await createGroupService(author, members, groupName);
    // Create a new group
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const getGroupsForUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const response = await getGroupsForUserService(userId);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const getUserForGroup = async (req, res) => {
  try {
    console.log("req.query:::", req.query);
    const groupId = req.query.groupId;
    console.log("groupId:::", groupId);
    const response = await getUserForGroupService(groupId);
    res.status(200).json(response);
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};

export const getLeadForGroup = async (req, res) => {
  try {
    const groupId = req.query.groupId;
    const response = await getLeadForGroupService(groupId);
    res.status(200).json(response);
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const response = await deteleGroupService(groupId);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const updatNameGroup = async (req, res) => {
  try {
    const { name, groupId } = req.body;
    const response = await updateNameGroupService(groupId, name);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const { groupId, members } = req.body;

    const response = await addMemberToGroupService(groupId, members);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const deleteMemeberFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const response = await deleteMemberFromGroupService(groupId, userId);
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const leaveGroup = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { groupId } = req.body;
    const response = await deleteMemberFromGroupService(groupId, userId);
    res.status(200).json(response);
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};

export const updateDeputyLeader = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const response = await updateDeputyLeaderService(groupId, userId);
    res.status(200).json(response);
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
// enpoint update image group
export const updateImageGroup = async (req, res) => {
  try {
    const groupId = req.body.groupId;
    console.log("groupId:::", groupId);
    if (!req.file) {
      return res.status(400).json({ EC: 1, EM: "No file provided", DT: "" });
    }
    cloud.uploader
      .upload_stream({ resource_type: "auto" }, async (error, result) => {
        if (error) {
          res.status(500).json({ EC: 1, EM: "Error", DT: error.message });
        } else {
          const group = await Group.findById(groupId);
          if (!group) {
            return res
              .status(404)
              .json({ EC: 1, EM: "Group not found", DT: "" });
          }
          group.avatar = result.secure_url;
          await group.save();
          res.status(200).json({ EC: 0, EM: "Success", DT: group });
        }
      })
      .end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ EC: 1, EM: error.message, DT: "" });
  }
};
//
export const getGroupById = async (req, res) => {
  try {
    console.log("req.query:::", req.query);
    const groupId = req.query.groupId;
    const response = await getGroupByIdService(groupId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
