import OTP from "../models/otp.model.js";
import bcrypt from "bcrypt";
import { insertOTP, validateOTP } from "../services/otp.service.js";
import { jest, it, describe, expect } from "@jest/globals";

jest.mock("../models/otp.model.js");
jest.mock("bcrypt");

describe("OTP Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should insert OTP successfully", async () => {
    const otp = "123456";
    const email = "test@example.com";
    const salt = "mockSalt";
    const hashOTP = "mockHashOTP";
    const createdOTP = { email, otp: hashOTP };
    bcrypt.genSalt.mockResolvedValueOnce(salt);
    bcrypt.hash.mockResolvedValueOnce(hashOTP);
    OTP.create.mockResolvedValueOnce(createdOTP);
    const result = await insertOTP(otp, email);
    expect(result).toBe(1);
  });

  it("should validate OTP successfully", async () => {
    const otp = "123456";
    const hashOTP = "mockHashOTP";
    const isValid = true;
    bcrypt.compare.mockResolvedValueOnce(isValid);
    const result = await validateOTP({ otp, hashOTP });
    expect(result).toBe(isValid);
  });

  it("should handle error when inserting OTP", async () => {
    const otp = "123456";
    const email = "test@example.com";
    const errorMessage = "Error inserting OTP";
    bcrypt.genSalt.mockRejectedValueOnce(new Error(errorMessage));
    const result = await insertOTP(otp, email);
    expect(result).toEqual({ message: errorMessage });
  });

  it("should handle error when validating OTP", async () => {
    const otp = "123456";
    const hashOTP = "mockHashOTP";
    const errorMessage = "Error validating OTP";
    bcrypt.compare.mockRejectedValueOnce(new Error(errorMessage));
    const result = await validateOTP({ otp, hashOTP });
    expect(result).toEqual({ message: errorMessage });
  });
});
