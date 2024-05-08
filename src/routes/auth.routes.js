import express from "express";
import {
  login,
  logout,
  reSendEmail,
  refreshToken,
  register,
  verifyOTP,
  forgotPassword,
  changePassword,
  account,
  resetPassword,
} from "../controllers/auth.controller.js";
import { verifyAccount } from "../middlewares/verifyAccount.js";
const router = express.Router();
/**
 * @openapi
 * '/api/auth/register':
 *  post:
 *     tags:
 *     - Auth
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - name
 *              - email
 *              - password
 *              - confirmPassword
 *              - gender
 *              - phoneNumer
 *            properties:
 *              name:
 *                type: string
 *                default: johndoe
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: johnDoe20!@
 *              confirmPassword:
 *                type: String
 *                default: johnDoe20!@
 *              gender:
 *                type: String
 *                default: Nam
 *              phoneNumer:
 *                type: String
 *                default: 0123456789
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post("/register", register);
/**
 * @openapi
 * '/api/auth/verifyOTP':
 *  post:
 *    tags:
 *    - Auth
 *    summary: Verify OTP (One Time Password)
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *              - otp
 *            properties:
 *              otp:
 *                type: string
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: OTP successfully verified
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
 */
router.post("/verifyOTP", verifyOTP);
/**
 * @openapi
 * '/api/auth/reSendEmail':
 *  post:
 *    tags:
 *    - Auth
 *    summary: Resend verification email
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: Verification email successfully resent
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
 */
router.post("/reSendEmail", reSendEmail);
/**
 * @openapi
 * '/api/auth/verifyAccount':
 *  post:
 *    tags:
 *    - Auth
 *    summary: Verify the account
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - token
 *            properties:
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        description: Account successfully verified
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
 */
router.post("/verifyAccount", verifyAccount);
/**
 * @openapi
 * '/api/auth/login':
 *  post:
 *    tags:
 *    - Auth
 *    summary: Log in to the application
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Successfully logged in
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/login", login);
/**
 * @openapi
 * '/api/auth/logout':
 *  post:
 *    tags:
 *    - Auth
 *    summary: Log out of the application
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Successfully logged out
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.post("/logout", logout);
/**
 * @openapi
 * '/api/auth/forgotPassword':
 *  post:
 *    tags:
 *    - Auth
 *    summary: Request a password reset
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - email
 *            properties:
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: Password reset email sent
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
 */
router.post("/forgotPassword", forgotPassword);
/**
 * @openapi
 * '/api/auth/resetPassword':
 *  post:
 *    tags:
 *    - Auth
 *    summary: Reset the password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - token
 *              - password
 *            properties:
 *              token:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Password successfully reset
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
 */
router.post("/resetPassword", resetPassword);
/**
 * @openapi
 * '/api/auth/changePassword':
 *  post:
 *    tags:
 *    - Auth
 *    summary: Change the password
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *              - oldPassword
 *              - newPassword
 *            properties:
 *              oldPassword:
 *                type: string
 *              newPassword:
 *                type: string
 *    responses:
 *      200:
 *        description: Password successfully changed
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server error
 */
router.post("/changePassword", changePassword);
/**
 * @openapi
 * '/api/auth/verifyAccount':
 *  get:
 *    tags:
 *    - Auth
 *    summary: Verify the account
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Account successfully verified
 *      401:
 *        description: Unauthorized
 *      500:
 *        description: Server error
 */
router.get("/verifyAccount", verifyAccount, account);
// router.post("/refreshToken", refreshToken);
router.post("/refreshToken", refreshToken);

export default router;
