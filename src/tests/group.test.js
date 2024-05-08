import { 
  createGroupService, 
  deteleGroupService, 
  addMemberToGroupService, 
  deleteMemberFromGroupService, 
  updateNameGroupService, 
  leaveGroupService, 
  getUserForGroupService, 
  getLeadForGroupService, 
  updateDeputyLeaderService 
} from "../services/group.service.js";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import { jest, it, describe, expect } from "@jest/globals";

jest.mock("../models/group.model.js");
jest.mock("../models/user.model.js");

describe("Group Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new group successfully", async () => {
    const authorId = "author123";
    const members = ["member1", "member2"];
    const groupName = "Test Group";
    const group = {
      _id: "group123",
      author: authorId,
      members,
      name: groupName,
    };
    User.findById.mockResolvedValueOnce({_id: authorId, groups: []});
    Group.mockReturnValueOnce(group);
    const result = await createGroupService(authorId, members, groupName);
    expect(result).toEqual({
      EC: 0,
      EM: "Create group successfully",
      DT: group,
    });
  });

  it("should return an error if group name is empty", async () => {
    const result = await createGroupService("author123", ["member1"], "");
    expect(result).toEqual({
      EC: 1,
      EM: "Group name is required",
      DT: "",
    });
  });

  it("should delete a group successfully", async () => {
    const groupId = "group123";
    Group.findById.mockResolvedValueOnce({ _id: groupId });
    User.updateOne.mockResolvedValueOnce({});
    User.updateMany.mockResolvedValueOnce({});
    Group.deleteOne.mockResolvedValueOnce({});
    const result = await deteleGroupService(groupId);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: "",
    });
  });

  it("should add member to a group successfully", async () => {
    const groupId = "group123";
    const members = ["member3"];
    const group = { _id: groupId, members: ["member1", "member2"] };
    Group.findById.mockResolvedValueOnce(group);
    User.findById.mockResolvedValueOnce({});
    User.findById.mockResolvedValueOnce({});
    Group.prototype.save.mockResolvedValueOnce({});
    const result = await addMemberToGroupService(groupId, members);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: group,
    });
  });

  it("should delete a member from a group successfully", async () => {
    const groupId = "group123";
    const userId = "user123";
    const group = { _id: groupId, members: ["user123", "user456"], deputyLeader: "user123" };
    Group.findById.mockResolvedValueOnce(group);
    User.findById.mockResolvedValueOnce({});
    User.prototype.save.mockResolvedValueOnce({});
    Group.prototype.save.mockResolvedValueOnce({});
    const result = await deleteMemberFromGroupService(groupId, userId);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: group,
    });
  });

  it("should update the name of a group successfully", async () => {
    const groupId = "group123";
    const newName = "Updated Group Name";
    const group = { _id: groupId };
    Group.findById.mockResolvedValueOnce(group);
    Group.prototype.save.mockResolvedValueOnce({});
    const result = await updateNameGroupService(groupId, newName);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: group,
    });
  });

  it("should allow a user to leave a group successfully", async () => {
    const userId = "user123";
    const groupId = "group123";
    const group = { _id: groupId, members: ["user123", "user456"], deputyLeader: "user123" };
    Group.findById.mockResolvedValueOnce(group);
    User.findById.mockResolvedValueOnce({});
    User.prototype.save.mockResolvedValueOnce({});
    Group.prototype.save.mockResolvedValueOnce({});
    const result = await leaveGroupService(userId, groupId);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: group,
    });
  });

  it("should get users for a group successfully", async () => {
    const groupId = "group123";
    const group = { _id: groupId, author: "author123", members: ["user123", "user456"], deputyLeader: "user123" };
    Group.findById.mockResolvedValueOnce(group);
    User.findById.mockResolvedValueOnce({});
    User.findById.mockResolvedValueOnce({});
    const result = await getUserForGroupService(groupId);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: ["author123", "user123", "user456"],
    });
  });

  it("should get leaders for a group successfully", async () => {
    const groupId = "group123";
    const group = { _id: groupId, author: "author123", deputyLeader: "user123" };
    Group.findById.mockResolvedValueOnce(group);
    User.findById.mockResolvedValueOnce({});
    User.findById.mockResolvedValueOnce({});
    const result = await getLeadForGroupService(groupId);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: { author: "author123", deputyLeader: "user123" },
    });
  });

  it("should update deputy leader for a group successfully", async () => {
    const groupId = "group123";
    const userId = "user123";
    const group = { _id: groupId, author: "author123", deputyLeader: null };
    Group.findById.mockResolvedValueOnce(group);
    Group.prototype.save.mockResolvedValueOnce({});
    const result = await updateDeputyLeaderService(groupId, userId);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: group,
    });
  });
});
