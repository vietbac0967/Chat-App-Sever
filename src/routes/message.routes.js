import express from "express";
import { verifyAccount } from "../middlewares/verifyAccount.js";
import {
  deleteMessage,
  forwardMessage,
  getMessages,
  getMessagesGroup,
  recallMessage,
  sendFile,
  sendImage,
  sendImageGroup,
  sendMessage,
  sendMessageGroup,
  sendVideo,
} from "../controllers/message.controller.js";
import updoad from "../middlewares/uploadImage.js";
import uploadFile from "../middlewares/uploadFile.js";
const router = express.Router();
/**
 * @openapi
 * '/message/sendMessage':
 *  post:
 *    tags:
 *    - Message
 *    summary: Send a message
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - message
 *            properties:
 *              message:
 *                type: string
 *    responses:
 *      200:
 *        description: Message sent successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/message/sendMessage", verifyAccount, sendMessage);
/**
 * @openapi
 * '/message/sendImage':
 *  post:
 *    tags:
 *    - Message
 *    summary: Send an image
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              image:
 *                type: string
 *                format: binary
 *    responses:
 *      200:
 *        description: Image sent successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post(
  "/message/sendImage",
  verifyAccount,
  updoad.single("image"),
  sendImage
);
/**
 * @openapi
 * '/message/getMessages':
 *  post:
 *    tags:
 *    - Message
 *    summary: Get messages
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Messages retrieved successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/message/getMessages", verifyAccount, getMessages);
/**
 * @openapi
 * '/message/deleteMessage':
 *  post:
 *    tags:
 *    - Message
 *    summary: Delete a message
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Message deleted successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/message/deleteMessage", verifyAccount, deleteMessage);
/**
 * @openapi
 * '/message/recallMessage':
 *  post:
 *    tags:
 *    - Message
 *    summary: Recall a message
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Message recalled successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/message/recallMessage", verifyAccount, recallMessage);
/**
 * @openapi
 * '/message/messagesGroup':
 *  get:
 *    tags:
 *    - Message
 *    summary: Get messages for a group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Messages retrieved successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/message/messagesGroup", verifyAccount, getMessagesGroup);
/**
 * @openapi
 * '/message/sendMessageGroup':
 *  post:
 *    tags:
 *    - Message
 *    summary: Send a message to a group
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - message
 *            properties:
 *              message:
 *                type: string
 *    responses:
 *      200:
 *        description: Message sent successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/message/sendMessageGroup", verifyAccount, sendMessageGroup);
/**
 * @openapi
 * '/message/sendImageGroup':
 *  post:
 *    tags:
 *    - Message
 *    summary: Send a image to a group
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - message
 *            properties:
 *              message:
 *                type: string
 *    responses:
 *      200:
 *        description: Message sent successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post(
  "/message/sendImageGroup",
  verifyAccount,
  updoad.single("image"),
  sendImageGroup
);
/**
 * @openapi
 * '/message/forwardMessage':
 *  post:
 *    tags:
 *    - Message
 *    summary: Forward a message
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - messageId
 *              - senderId
 *              - groupId (optional)
 *              - receiverId (optional)
 *            properties:
 *              messageId:
 *                type: string
 *              senderId:
 *                type: ObjectId
 *              groupId:
 *                type: String
 *              receiverId:
 *                type: String
 *    responses:
 *      200:
 *        description: Message forwarded successfully
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/message/forwardMessage", verifyAccount, forwardMessage);
router.post(
  "/message/sendFile",
  verifyAccount,
  uploadFile.single("file"),
  sendFile
);
router.post("/message/sendVideo",verifyAccount,uploadFile.single("video"),sendVideo);
export default router;
