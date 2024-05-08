import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();
import {
  generateRefreshToken,
  generateAccessToken,
} from "../utils/generateToken.js";
import {
  validateEmail,
  validateField,
  validatePassword,
  validatePhoneNumber,
} from "../utils/validate.js";
import jwt from "jsonwebtoken";
import { insertOTP, validateOTP } from "../services/otp.service.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import OTP from "../models/otp.model.js";
import { sendOTPForUser, sendOTPForgotPassword } from "./sendMail.service.js";
import { client } from "../config/connectToRedis.js";
import logger from "../helpers/winston.log.js";
export const verifyOTPService = async ({ email, otp }) => {
  try {
    const otpHolder = await OTP.find({ email });
    if (otpHolder.length === 0)
      return {
        EC: 1,
        EM: "OTP expired",
        DT: "",
      };
    // get last otp
    const lastOTP = otpHolder[otpHolder.length - 1];
    const isValid = await validateOTP({ otp, hashOTP: lastOTP.otp });
    if (!isValid) return { EC: 1, EM: "Invalid OTP", DT: "" };
    if (isValid && email === lastOTP.email) {
      // update user verify
      const user = await User.findOne({ email });
      user.verify = true;
      await user.save();
      return {
        EC: 0,
        EM: "Success",
        DT: user.verify,
      };
    }
  } catch (err) {
    return {
      EC: 1,
      EM: err.message,
      DT: "",
    };
  }
};

/*
  - Check if any required data is missing
  - Validate email, phone number, and password
  - Check if passwords match
  - Check if the user already exists
  - Hash the password
  - Create a new user object
  - Save the new user to the database
  - create OTP for user
  - send mail to user
  - insert OTP to database
  - Return success message and the newly created user object
*/
export const registerService = async (data) => {
  try {
    const { name, phoneNumber, email, password, gender, confirmPassword } =
      data;

    if (
      !validateField(name) ||
      !validateField(phoneNumber) ||
      !validateField(email) ||
      !validateField(password) ||
      !validateField(gender) ||
      !validateField(confirmPassword)
    ) {
      logger.error("Data is empty");
      return {
        EC: 1,
        EM: "Data is empty",
        DT: "",
      };
    }

    if (
      !validateEmail(email) ||
      !validatePhoneNumber(phoneNumber) ||
      !validatePassword(password)
    ) {
      return {
        EC: 1,
        EM: "Invalid data",
        DT: "",
      };
    }

    if (password !== confirmPassword) {
      return {
        EC: 1,
        EM: "Password does not match",
        DT: "",
      };
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    // console.log("ExistingUser::::", existingUser);
    if (existingUser) {
      return {
        EC: 1,
        EM: "User already exists",
        DT: "",
      };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${name}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${name}`;
    const newUser = new User({
      name,
      phoneNumber,
      email,
      password: hashedPassword,
      gender,
      avatar: gender === "Nam" ? boyProfilePic : girlProfilePic,
      verify: false,
    });
    await newUser.save();

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const { EC, EM, DT } = await sendOTPForUser(otp, email);
    if (EC === 0 && EM === "Success") {
      await insertOTP(otp, email);
      return {
        EC: 0,
        EM: "Success",
        DT,
      };
    } else {
      return {
        EC: 1,
        EM: "Failed",
        DT: "",
      };
    }
  } catch (err) {
    return { EC: 1, EM: err.message, DT: "" };
  }
};

// Login service function
export const loginService = async (data) => {
  try {
    const { username, password } = data;
    if (username.trim() === "" || password.trim() === "") {
      logger.error("Username or password is empty");
      return {
        EC: 1,
        EM: "Username or password is empty",
        DT: "",
      };
    }
    const user = await User.findOne({
      $or: [{ phoneNumber: username }, { email: username }],
    });

    if (!user) {
      return {
        EC: 1,
        EM: "User not found",
        DT: "",
      };
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return {
        EC: 1,
        EM: "User not found",
        DT: "",
      };
    }
    if (!user.verify) {
      return {
        EC: 1,
        EM: "User not verified",
        DT: "",
      };
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);
    return {
      EC: 0,
      EM: "Success",
      DT: {
        accessToken,
        refreshToken,
      },
    };
  } catch (err) {
    return {
      EC: 1,
      EM: err.message,
      DT: "",
    };
  }
};

export const forgotPasswordService = async (data) => {
  try {
    const email = data;

    if (!validateEmail(email)) {
      return {
        EC: 1,
        EM: "Invalid data",
        DT: "",
      };
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return {
        EC: 1,
        EM: "User not found",
        DT: "",
      };
    }
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const { EC, EM, DT } = await sendOTPForgotPassword(otp, email);
    if (EC === 0 && EM === "Success") {
      await insertOTP(otp, email);
      return {
        EC: 0,
        EM: "Success",
        DT,
      };
    } else {
      return {
        EC: 1,
        EM: "Failed",
        DT: "",
      };
    }
  } catch (err) {
    return { EC: 1, EM: err.message, DT: "" };
  }
};
export const resetPasswordService = async (
  email,
  password,
  confirmPassword
) => {
  try {
    if (password !== confirmPassword) {
      return {
        EC: 1,
        EM: "Password does not match",
        DT: "",
      };
    }

    if (!validatePassword(password)) {
      return {
        EC: 1,
        EM: "Weak password",
        DT: "",
      };
    }

    const user = await User.findOne({ email });
    const passwordExist = await bcrypt.compare(password, user.password);
    if (passwordExist) {
      return {
        EC: 1,
        EM: "Password is the same",
        DT: "",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    await user.save();
    return {
      EC: 0,
      EM: "Success",
      DT: user,
    };
  } catch (err) {
    return {
      EC: 1,
      EM: err.message,
      DT: "",
    };
  }
};

export const changePasswordService = async (
  email,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    if (newPassword !== confirmPassword) {
      return {
        EC: 1,
        EM: "Password does not match",
        DT: "",
      };
    }

    if (!validatePassword(newPassword)) {
      return {
        EC: 1,
        EM: "Weak password",
        DT: "",
      };
    }

    const user = await User.findOne({ email });
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (!comparePassword) {
      return {
        EC: 1,
        EM: "Old password is incorrect",
        DT: "",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log("HashPassword::::", hashedPassword);
    user.password = hashedPassword;
    await user.save();
    return {
      EC: 0,
      EM: "Success",
      DT: user,
    };
  } catch (err) {
    return {
      EC: 1,
      EM: err.message,
      DT: "",
    };
  }
};
export const refreshTokenService = async (token) => {
  try {
    if (!token) {
      return {
        EC: 1,
        EM: "Refresh token is empty",
        DT: "",
      };
    }
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      return {
        EC: 1,
        EM: "Invalid refresh token",
        DT: "",
      };
    }
    const existToken = await client.get(decoded.id);
    if (!existToken) {
      return {
        EC: 1,
        EM: "Jwt is not exist in redis",
        DT: "",
      };
    }
    if (token !== existToken) {
      logger.error("Token and redis token are not the same");
      return {
        EC: 1,
        EM: "Token and redis token are not the same",
        DT: "",
      };
    }
    const accessToken = generateAccessToken(decoded.id);
    const refreshToken = await generateRefreshToken(decoded.id);
    return {
      EC: 0,
      EM: "Success",
      DT: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    return {
      EC: 1,
      EM: error.message,
      DT: "",
    };
  }
};
