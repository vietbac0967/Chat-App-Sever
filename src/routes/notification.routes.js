import express from "express";
import { verifyAccount } from "../middlewares/verifyAccount.js";
import {
  getNotifications,
  readNotification,
  sendNotification,
} from "../controllers/notification.controller.js";
const router = express.Router();

router.post("/sendNotification", verifyAccount, sendNotification);
router.get("/getNotifications", verifyAccount, getNotifications);
router.post("/readNotification", verifyAccount, readNotification);
export default router;
