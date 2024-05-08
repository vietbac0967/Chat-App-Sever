import {
  resetPasswordService,
  loginService,
  registerService,
  verifyOTPService,
  changePasswordService,
  refreshTokenService,
} from "../services/auth.service.js";
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import { sendOTPForUser } from "../services/sendMail.service.js";
import { insertOTP } from "../services/otp.service.js";
import { forgotPasswordService } from "../services/auth.service.js";
import { client } from "../config/connectToRedis.js";

// endpoint to register user
export const register = async (req, res) => {
  try {
    const { EC, EM, DT } = await registerService(req.body);
    return res.status(201).json({ EC, EM, DT });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json(error.message);
  }
};
// endpoint to verify OTP
export const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const { EM, EC, DT } = await verifyOTPService({ email, otp });
    res.status(200).json({ EC, EM, DT });
  } catch (error) {
    next(error);
  }
};
// endpoint to resend email
export const reSendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    // create OTP for user
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    // insert OTP to database
    await insertOTP(otp, email);
    // send mail to user
    const { EC, EM, DT } = await sendOTPForUser(otp, email);
    res.status(200).json({ EC, EM, DT });
  } catch (err) {
    res.status(500).json({
      EC: 1,
      EM: err.message,
      DT: "",
    });
  }
};
// endpoint to login user
export const login = async (req, res) => {
  try {
    const { EC, EM, DT } = await loginService(req.body);
    if (DT) {
      res.cookie("accessToken", DT.accessToken, {
        maxAge: 86400000,
        httpOnly: true,
      });
      res.cookie("refreshToken", DT.refreshToken, {
        maxAge: 86400000,
        httpOnly: true,
      });
    }
    res.status(200).json({ EC, EM, DT });
  } catch (error) {
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to logout user
export const logout = async (req, res) => {
  try {
    const token = req.body.token;
    const verify = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (!verify) {
      return res.status(403).json({
        EC: 1,
        EM: "Invalid token",
        DT: "",
      });
    }
    const existToken = await client.get(verify.id);
    if (!existToken) {
      return res.status(404).json({
        EC: 1,
        EM: "Token not found",
        DT: "",
      });
    }
    if (existToken !== token) {
      return res.status(404).json({
        EC: 1,
        EM: "Token not match",
        DT: "",
      });
    }
    await client.del(verify.id);
    res.status(200).json({
      EC: 0,
      EM: "Success",
      DT: "",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};
// endpoint to refresh token
export const refreshToken = async (req, res) => {
  try {
    const token = req.body.token;
    console.log("token is::", token);
    const refreshToken = await refreshTokenService(token);
    return res.status(200).json(refreshToken);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ EC: 1, EM: error.message, DT: "" });
  }
};
// endpoint to forgot password
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const { EC, EM, DT } = await forgotPasswordService(email);
    res.status(200).json({ EC, EM, DT });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

// export const forgotPasswordOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;
//     const { EM, EC, DT } = await forgotPasswordOTPService({ email, otp });
//     res.status(200).json({ EC, EM, DT });
//   } catch (error) {
//     console.log(error.message);
//     res.status(500).json({
//       EC: 1,
//       EM: error.message,
//       DT: "",
//     });
//   }
// };
// endpoint to change password
export const resetPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const response = await resetPasswordService(
      email,
      newPassword,
      confirmPassword
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const email = req.body.email;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const response = await changePasswordService(
      email,
      newPassword,
      confirmPassword
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      EC: 1,
      EM: error.message,
      DT: "",
    });
  }
};

export const account = (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({
        EC: 0,
        EM: "verify account success",
        DT: req.user,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
