import Message from "../models/message.model.js";
import { 
  sendMessageService, 
  getMessagesService, 
  deleteMessageService, 
  recallMessageService, 
  sendMessageGroupService, 
  getMessagesGroupService 
} from "../services/message.service.js";
import { jest, it, describe, expect } from "@jest/globals";

jest.mock("../models/message.model.js");

describe("Message Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send a message successfully", async () => {
    const receiverId = "receiver123";
    const senderId = "sender123";
    const content = "Hello";
    const messageType = "text";
    const message = { _id: "message123", senderId, receiverId, content, messageType };
    Message.prototype.save.mockResolvedValueOnce(message);
    Message.findById.mockResolvedValueOnce(message);
    const result = await sendMessageService(receiverId, senderId, content, messageType);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: message,
    });
  });

  it("should get messages between two users successfully", async () => {
    const senderId = "sender123";
    const receiverId = "receiver123";
    const messages = [{ content: "Hello", senderId: "sender123", receiverId: "receiver123" }];
    Message.find.mockResolvedValueOnce(messages);
    const result = await getMessagesService(senderId, receiverId);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: messages,
    });
  });

  it("should delete a message successfully", async () => {
    const messageId = "message123";
    const senderId = "sender123";
    const message = { _id: messageId };
    Message.findByIdAndUpdate.mockResolvedValueOnce(message);
    const result = await deleteMessageService(messageId, senderId);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: message,
    });
  });

  it("should recall a message successfully", async () => {
    const messageId = "message123";
    const message = { _id: messageId };
    Message.findByIdAndDelete.mockResolvedValueOnce(message);
    const result = await recallMessageService(messageId);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: message,
    });
  });

  it("should send a message to a group successfully", async () => {
    const senderId = "sender123";
    const groupId = "group123";
    const content = "Hello Group";
    const messageType = "text";
    const message = { _id: "message123", senderId, groupId, content, messageType };
    Message.prototype.save.mockResolvedValueOnce(message);
    Message.findById.mockResolvedValueOnce(message);
    const result = await sendMessageGroupService(senderId, groupId, content, messageType);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: message,
    });
  });

  it("should get messages for a group successfully", async () => {
    const groupId = "group123";
    const senderId = "sender123";
    const messages = [{ content: "Hello Group", groupId: "group123" }];
    Message.find.mockResolvedValueOnce(messages);
    const result = await getMessagesGroupService(groupId, senderId);
    expect(result).toEqual({
      EC: 0,
      EM: "Success",
      DT: messages,
    });
  });
});
