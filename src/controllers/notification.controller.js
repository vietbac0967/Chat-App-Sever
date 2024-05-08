import {
  createNotificationService,
  getNotificationsService,
  readNotificationService,
} from "../services/notification.service.js";

export const sendNotification = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, groupId, messageType, content } = req.body;
    const notification = await createNotificationService(
      senderId,
      receiverId,
      groupId,
      content,
      messageType
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ EC: 1, EM: error.message, DT: "" });
  }
};
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const { receiver } = req.query;
    const notifications = await getNotificationsService(receiver, userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ EC: 1, EM: error.message, DT: "" });
  }
};
export const readNotification = async (req, res) => {
  try {
    const userId = req.user._id
    const { receiver } = req.body;
    const notifications = await readNotificationService(receiver, userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ EC: 1, EM: error.message, DT: "" });
  }
};
