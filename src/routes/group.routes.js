import express from "express";
import { verifyAccount } from "../middlewares/verifyAccount.js";
import {
  addMemberToGroup,
  createGroup,
  deleteGroup,
  deleteMemeberFromGroup,
  getGroupById,
  getGroupsForUser,
  getLeadForGroup,
  getUserForGroup,
  leaveGroup,
  updatNameGroup,
  updateDeputyLeader,
  updateImageGroup,
} from "../controllers/group.controller.js";
import upload from "../middlewares/uploadImage.js";
const router = express.Router();
/**
 * @openapi
 * '/api/group/create':
 *  post:
 *    tags:
 *    - Group
 *    summary: Create a new group
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - authorId
 *              - members
 *              - groupName
 *            properties:
 *              authorId:
 *                type: ObjectId
 *              members:
 *                type: []
 *              groupName:
 *                type: String
 *    responses:
 *      200:
 *        description: Successfully created a new group
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/create", verifyAccount, createGroup);
/**
 * @openapi
 * '/api/group/getGroups':
 *  get:
 *    tags:
 *    - Group
 *    summary: Get all groups for the authenticated user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved all groups
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/getGroups", verifyAccount, getGroupsForUser);
/**
 * @openapi
 * '/api/group/deleteGroup':
 *  post:
 *    tags:
 *    - Group
 *    summary: Delete a group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully deleted the group
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/deleteGroup", verifyAccount, deleteGroup);
/**
 * @openapi
 * '/api/group/getUserForGroup':
 *  get:
 *    tags:
 *    - Group
 *    summary: Get users for a specific group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved users for the group
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/getUserForGroup", verifyAccount, getUserForGroup);
/**
 * @openapi
 * '/api/group/leaveGroup':
 *  post:
 *    tags:
 *    - Group
 *    summary: Leave a group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully left the group
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/leaveGroup", verifyAccount, leaveGroup);
/**
 * @openapi
 * '/api/group/updateNameGroup':
 *  post:
 *    tags:
 *    - Group
 *    summary: Leave a group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully left the group
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/updateNameGroup", verifyAccount, updatNameGroup);
/**
 * @openapi
 * '/api/group/addMember':
 *  post:
 *    tags:
 *    - Group
 *    summary: Add new member to a group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully left the group
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/addMember", verifyAccount, addMemberToGroup);
/**
 * @openapi
 * '/api/group/lead':
 *  post:
 *    tags:
 *    - Group
 *    summary: Get leader and deputy leader for a group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully left the group
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/lead", verifyAccount, getLeadForGroup);
/**
 * @openapi
 * '/api/group/deleteMemeber':
 *  post:
 *    tags:
 *    - Group
 *    summary: Delete a memeber from a group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully left the group
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/deleteMember", verifyAccount, deleteMemeberFromGroup);
/**
 * @openapi
 * '/api/group/updateDeputyLeader':
 *  post:
 *    tags:
 *    - Group
 *    summary: Update deputy leader for a group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully left the group
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/updateDeputyLeader", verifyAccount, updateDeputyLeader);
/**
 * @openapi
 * '/api/group/updateImageGroup':
 *  post:
 *    tags:
 *    - Group
 *    summary: Update image for a group
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully left the group
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post(
  "/updateImageGroup",
  verifyAccount,
  upload.single("image"),
  updateImageGroup
);

router.get("/byId", verifyAccount, getGroupById);
export default router;
