import {
  findUserByPhone,
  showFriends,
  getUserByIdService,
  sendFriendRequestToUser,
  showFriendRequests,
  acceptFriendRequestToUser,
  rejectFriendRequestToUser,
  showSentFriendRequests,
  getUserInfoService,
  updateUserInfoService,
  updateUserImageService,
  getFriendsNotInGroupService,
  deleteFriendService,
} from "../services/user.service.js";
import { jest, it, describe, expect } from "@jest/globals";
import User from "../models/user.model.js";

jest.mock("../models/user.model.js");

describe("User Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should find user by phone number successfully", async () => {
    const phone = "123456789";
    const senderId = "sender123";
    const user = { phoneNumber: phone, friends: [] };
    User.findOne.mockResolvedValueOnce(user);

    const result = await findUserByPhone(phone, senderId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: user });
  });

  it("should show user's friends successfully", async () => {
    const userId = "userId123";
    const user = { friends: ["friend1", "friend2"] };
    User.findById.mockResolvedValueOnce(user);

    const result = await showFriends(userId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: user.friends });
  });

  it("should get user by ID successfully", async () => {
    const userId = "userId123";
    const user = { name: "John", phoneNumber: "12345", avatar: "avatar.png", _id: userId };
    User.findById.mockResolvedValueOnce(user);

    const result = await getUserByIdService(userId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: user });
  });

  it("should send friend request to user successfully", async () => {
    const senderId = "sender123";
    const receiverId = "receiver123";

    const result = await sendFriendRequestToUser(senderId, receiverId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: "" });
  });

  it("should show user's friend requests successfully", async () => {
    const userId = "userId123";
    const user = { friendRequests: ["request1", "request2"] };
    User.findById.mockResolvedValueOnce(user);

    const result = await showFriendRequests(userId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: user.friendRequests });
  });

  it("should accept friend request successfully", async () => {
    const senderId = "sender123";
    const receiverId = "receiver123";
    const sender = { friends: [], friendRequests: [receiverId] };
    const receiver = { friends: [], friendRequests: [] };
    User.findById.mockResolvedValueOnce(sender);
    User.findById.mockResolvedValueOnce(receiver);
    User.findByIdAndUpdate.mockResolvedValueOnce(sender);
    User.findByIdAndUpdate.mockResolvedValueOnce(receiver);

    const result = await acceptFriendRequestToUser(senderId, receiverId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: "" });
  });

  it("should reject friend request successfully", async () => {
    const senderId = "sender123";
    const receiverId = "receiver123";
    const sender = { friendRequests: [receiverId] };
    const receiver = { friendRequests: [] };
    User.findById.mockResolvedValueOnce(sender);
    User.findById.mockResolvedValueOnce(receiver);
    User.findByIdAndUpdate.mockResolvedValueOnce(sender);
    User.findByIdAndUpdate.mockResolvedValueOnce(receiver);

    const result = await rejectFriendRequestToUser(senderId, receiverId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: "" });
  });

  it("should show sent friend requests successfully", async () => {
    const userId = "userId123";
    const user = { sentFriendRequests: ["request1", "request2"] };
    User.findById.mockResolvedValueOnce(user);

    const result = await showSentFriendRequests(userId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: user.sentFriendRequests });
  });

  it("should get user info successfully", async () => {
    const userId = "userId123";
    const user = { name: "John", phoneNumber: "12345", avatar: "avatar.png" };
    User.findById.mockResolvedValueOnce(user);

    const result = await getUserInfoService(userId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: user });
  });

  it("should update user info successfully", async () => {
    const userId = "userId123";
    const updatedUserInfo = { name: "John Doe", gender: "male", phoneNumber: "123456789", email: "john@example.com" };
    const user = { save: jest.fn() };
    User.findOne.mockResolvedValueOnce(user);

    const result = await updateUserInfoService(userId, updatedUserInfo);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: user });
  });

  it("should update user image successfully", async () => {
    const userId = "userId123";
    const image = "avatar.png";
    const user = { save: jest.fn() };
    User.findOne.mockResolvedValueOnce(user);

    const result = await updateUserImageService(userId, image);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: "" });
  });

  it("should get friends not in group successfully", async () => {
    const userId = "userId123";
    const groupId = "groupId123";
    const user = { friends: [{ _id: "friend1" }, { _id: "friend2" }] };
    const group = { deputyLeader: "leaderId" };
    User.findById.mockResolvedValueOnce(user);
    User.find.mockResolvedValueOnce([{ _id: "friend1" }, { _id: "friend2" }]);
    User.findById.mockResolvedValueOnce(group);

    const result = await getFriendsNotInGroupService(userId, groupId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: user.friends });
  });

  it("should delete friend successfully", async () => {
    const userId = "userId123";
    const friendId = "friendId123";
    const user = { save: jest.fn() };
    User.findByIdAndUpdate.mockResolvedValueOnce(user);
    User.findByIdAndUpdate.mockResolvedValueOnce(user);

    const result = await deleteFriendService(userId, friendId);

    expect(result).toEqual({ EC: 0, EM: "Success", DT: "" });
  });
});
