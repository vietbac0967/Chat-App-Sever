import {
  getConversationForwardsService,
  getConversationService,
} from "../services/conversation.service.js";

export const getConverstations = async (req, res) => {
  try {
    const userId = req.user._id;
    const response = await getConversationService(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ EC: 1, EM: error.message, DT: "" });
  }
};

export const getConversationForward = async (req, res) => {
  try {
    const userId = req.user._id;
    const messageId = req.query.messageId;
    const response = await getConversationForwardsService(userId, messageId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ EC: 1, EM: error.message, DT: "" });
  }
};
