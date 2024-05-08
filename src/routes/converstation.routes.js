import express from "express";

const router = express.Router();
import { verifyAccount } from "../middlewares/verifyAccount.js";
import {
  getConversationForward,
  getConverstations,
} from "../controllers/converstation.controller.js";
/**
 * @openapi
 * '/api/conversation/getAll':
 *  get:
 *    tags:
 *    - Conversation
 *    summary: Get all conversations for the authenticated user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved all conversations
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/getAll", verifyAccount, getConverstations);
/**
 * @openapi
 * '/api/conversation/getForward':
 *  get:
 *    tags:
 *    - Conversation
 *    summary: Get forward conversations for the authenticated user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved forward conversations
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/getForward", verifyAccount, getConversationForward);
export default router;
