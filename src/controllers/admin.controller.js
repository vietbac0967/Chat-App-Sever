import logger from "../helpers/winston.log.js";
import {
  getAllUserService,
  getFriendsFollowMonthAndYearService,
  getNewRegisterUsersService,
  getNumberOfSendImageService,
  getNumberOfSendMessaagesService,
  getTotalDataSizeOfUserService,
} from "../services/admin.service.js";

export const getAllUser = async (req, res) => {
  try {
    const admin = req.user._id;
    const { EC, EM, DT } = await getAllUserService(admin);
    return res.status(200).json({ EC, EM, DT });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const getNumberOfSendMessaages = async (req, res) => {
  try {
    const userId = req.query?.userId;
    console.log("user id is:::", userId);
    const { EC, EM, DT } = await getNumberOfSendMessaagesService(userId);
    return res.status(200).json({ EC, EM, DT });
  } catch (error) {
    return res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const getNumberOfSendImage = async (req, res) => {
  try {
    const userId = req.query?.userId;
    const { EC, EM, DT } = await getNumberOfSendImageService(userId);
    return res.status(200).json({ EC, EM, DT });
  } catch (error) {
    return res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
export const getFriendsFollowMonthAndYear = async (req, res) => {
  try {
    const { userId, month, year } = req.query;
    const { EC, EM, DT } = await getFriendsFollowMonthAndYearService(
      userId,
      month,
      year
    );
    return res.status(200).json({ EC, EM, DT });
  } catch (error) {
    logger.error(`500 ${error.message}`);
    return res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const getNewRegisterUsers = async (req, res) => {
  try {
    const { month, year } = req.query;
    const { EC, EM, DT } = await getNewRegisterUsersService(month, year);
    return res.status(200).json({ EC, EM, DT });
  } catch (error) {
    return res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const getTotalDataSizeOfUser = async (req, res) => {
  try {
    const userId = req.query?.userId;
    const { EC, EM, DT } = await getTotalDataSizeOfUserService(userId);
    return res.status(200).json({ EC, EM, DT });
  } catch (error) {
    return res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
