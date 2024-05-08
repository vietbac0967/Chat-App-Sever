import express from "express";
import { verifyAccount } from "../middlewares/verifyAccount.js";
import {
  acceptFriendRequest,
  deleteFriend,
  getFriendRequests,
  getFriends,
  getFriendsInNotGroup,
  getSentFriendRequests,
  getUser,
  getUserByPhone,
  getUserInfo,
  rejectFriendRequest,
  sendFriendRequest,
  updatedUserInfo,
  updateUserImage,
} from "../controllers/user.controller.js";
import upload from "../middlewares/uploadImage.js";
const router = express.Router();
router.post("/user", verifyAccount, getUser);
/**
 * @openapi
 * '/user/info':
 *  get:
 *    tags:
 *    - User
 *    summary: Get user information
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/info", verifyAccount, getUserInfo);
/**
 * @openapi
 * '/api/user/getFriendRequests':
 *  get:
 *    tags:
 *    - User
 *    summary: Get friend requests for user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/user/getFriendRequests", verifyAccount, getFriendRequests);
/**
 * @openapi
 * '/api/user/getFriends':
 *  get:
 *    tags:
 *    - User
 *    summary: Get friends for user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/user/getFriends", verifyAccount, getFriends);
/**
 * @openapi
 * '/user/getByPhone':
 *  get:
 *    tags:
 *    - User
 *    summary: Get user by phone number
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/user/getByPhone", verifyAccount, getUserByPhone);
/**
 * @openapi
 * '/user/sendFriendRequest':
 *  get:
 *    tags:
 *    - User
 *    summary: Send a friend request to a user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/user/sendFriendRequest", verifyAccount, sendFriendRequest);
/**
 * @openapi
 * '/user/acceptFriendRequest':
 *  get:
 *    tags:
 *    - User
 *    summary: Accept a friend request from a user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/user/acceptFriendRequest", verifyAccount, acceptFriendRequest);
/**
 * @openapi
 * '/api/user/rejectFriendRequest':
 *  get:
 *    tags:
 *    - User
 *    summary: Reject a friend request from a user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/user/rejectFriendRequest", verifyAccount, rejectFriendRequest);
/**
 * @openapi
 * 'api/user/deleteFriend':
 *  get:
 *    tags:
 *    - User
 *    summary: Delete a friend from user's friend list
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/user/deleteFriend", verifyAccount, deleteFriend);
/**
 * @openapi
 * '/user/getSentFriendRequests':
 *  get:
 *    tags:
 *    - User
 *    summary: Get sent friend requests for user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully retrieved user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/user/getSentFriendRequests", verifyAccount, getSentFriendRequests);
/**
 * @openapi
 * '/api/user/updateImage':
 *  post:
 *    tags:
 *    - User
 *    summary: Update iamge for user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully updated user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post(
  "/user/updateImage",
  verifyAccount,
  upload.single("image"),
  updateUserImage
);
/**
 * @openapi
 * '/api/user/getFriendsInNotGroup':
 *  post:
 *    tags:
 *    - User
 *    summary: Get friends not in a group for user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully updated user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/user/getFriendsInNotGroup", verifyAccount, getFriendsInNotGroup);
/**
 * @openapi
 * '/api/user/update':
 *  post:
 *    tags:
 *    - User
 *    summary: Update user information
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully updated user information
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/update", verifyAccount, updatedUserInfo);
router.post(
  "/user/updateImage",
  verifyAccount,
  upload.single("image"),
  updateUserImage
);
export default router;
