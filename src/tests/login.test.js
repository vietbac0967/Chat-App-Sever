import { loginService } from "../services/auth.service.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { jest, it, describe, expect } from "@jest/globals";


jest.mock("../models/user.model.js");
jest.mock("bcrypt");

describe("loginService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return error if username or password is empty", async () => {
    const result = await loginService({ username: "", password: "" });
    expect(result).toEqual({
      EC: 1,
      EM: "Username or password is empty",
      DT: "",
    });
  });

  it("should return error if user is not found", async () => {
    User.findOne.mockResolvedValueOnce(null);
    const result = await loginService({
      username: "user1@gmail.com",
      password: "@123123Az",
    });
    expect(result).toEqual({
      EC: 1,
      EM: "User not found",
      DT: "",
    });
  });

  it("should return error if password is incorrect", async () => {
    const mockUser = {
      _id: "user123",
      email: "user123@gmail.com",
      password: "failPassword",
      verify: true,
    };
    User.findOne.mockResolvedValueOnce(mockUser);
    bcrypt.compare.mockResolvedValueOnce(false);
    const result = await loginService({
      username: "user123@gmail.com",
      password: "failPassword",
    });
    expect(result).toEqual({
      EC: 1,
      EM: "Password is incorrect",
      DT: "",
    });
  });

  it("should return error if user is not verified", async () => {
    const mockUser = {
      _id: "user134",
      email: "user134@gmail.com",
      password: "@123123Az",
      verify: false,
    };
    User.findOne.mockResolvedValueOnce(mockUser);
    bcrypt.compare.mockResolvedValueOnce(true);
    const result = await loginService({
      username: "user134@gmail.com",
      password: "@123123Az",
    });
    expect(result).toEqual({
      EC: 1,
      EM: "User not verified",
      DT: "",
    });
  });

  it("should return token if login successful", async () => {
    const mockUser = {
      _id: "userSuccess",
      email: "duongngoc378@gmail.com",
      password: "@123123Az",
      verify: true,
    };
    User.findOne.mockResolvedValueOnce(mockUser);
    bcrypt.compare.mockResolvedValueOnce(true);
    const result = await loginService({
      username: "duongngoc378@gmail.com",
      password: "@123123Az",
    });
    expect(result).toEqual({
        EC: 0,
        EM: "Success",
        DT: "",
      });
  });
});
