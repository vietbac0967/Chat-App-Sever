import { registerService } from "../services/auth.service.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import { sendOTPForUser } from "../services/sendMail.service.js";
import { jest, it, describe, expect } from "@jest/globals";

jest.mock("../models/user.model.js");
jest.mock("bcrypt");
jest.mock("otp-generator");
jest.mock("../services/sendMail.service.js");

describe("registerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if data is empty", async () => {
    const result = await registerService({});
    expect(result).toEqual({
      EC: 1,
      EM: "Data is empty",
      DT: "",
    });
  });

  it("should return error if email or phone number already exists", async () => {
    User.findOne.mockResolvedValueOnce(true);
    const result = await registerService({
      name: "test",
      phoneNumber: "0359395747",
      email: "duongngoc378@gmail.com",
      password: "Vip@12345",
      gender: "male",
      confirmPassword: "Vip@12345",
    });
    expect(result).toEqual({
      EC: 1,
      EM: "User already exists",
      DT: "",
    });
  });

  it("should return error if password and confirm password do not match", async () => {
    User.findOne.mockResolvedValueOnce(false);
    const result = await registerService({
      name: "Nguyen Van Hoang",
      phoneNumber: "0815612561",
      email: "test@gmail.com",
      gender: "Nam",
      password: "Vip@12345",
      confirmPassword: "@Vip@1234",
    });
    expect(result).toEqual({
      EC: 1,
      EM: "Password does not match",
      DT: "",
    });
  });

  it("should return success if all data is valid and user does not exist", async () => {
    User.findOne.mockResolvedValueOnce(false);
    bcrypt.genSalt.mockResolvedValueOnce("salt");
    bcrypt.hash.mockResolvedValueOnce("hashedPassword");
    otpGenerator.generate.mockReturnValueOnce("123456");
    const otp = otpGenerator.generate(6,{
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    })
    sendOTPForUser.mockResolvedValueOnce({
      EC: 0,
      EM: "Success",
      DT: otp,
    });
    const result = await registerService({
      name: "test",
      phoneNumber: "0815712515",
      email: "test@gmail.com",
      password: "Vip@12345",
      gender: "Nam",
      confirmPassword: "Vip@12345",
    });
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: otp,
    });
  });
});
