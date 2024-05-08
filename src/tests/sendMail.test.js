import nodemailer from "nodemailer";
import { sendOTPForUser, sendOTPForgotPassword } from "../services/sendMail.service.js";
import { jest, it, describe, expect } from "@jest/globals";

jest.mock("nodemailer");

describe("Send Mail Service Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send OTP for user successfully", async () => {
    const otp = "123456";
    const toEmail = "test@example.com";
    const sendMailMock = jest.fn();
    nodemailer.createTransport.mockReturnValueOnce({ sendMail: sendMailMock });
    await sendOTPForUser(otp, toEmail);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: { name: "Surprise Message", address: "testingmtt2808@gmail.com" },
      to: toEmail,
      subject: "Xác nhận đăng ký tài khoản thành công!",
      text: `Bạn đã tạo tài khoản thành công trên Surprise Message. Dưới đây là mã OTP để hoàn tất quá trình đăng ký. \n\nMã OTP của bạn là ${otp}`,
      html: `<p>Bạn đã tạo tài khoản thành công trên Surprise Message. Dưới đây là mã OTP để hoàn tất quá trình đăng ký. <br/><br/>Mã OTP của bạn là <b>${otp}</b></p>`
    });
  });

  it("should send OTP for forgot password successfully", async () => {
    const otp = "123456";
    const toEmail = "test@example.com";
    const sendMailMock = jest.fn();
    nodemailer.createTransport.mockReturnValueOnce({ sendMail: sendMailMock });
    await sendOTPForgotPassword(otp, toEmail);
    expect(sendMailMock).toHaveBeenCalledWith({
      from: { name: "Surprise Message", address: "testingmtt2808@gmail.com" },
      to: toEmail,
      subject: "Yêu cầu khôi phục mật khẩu thành công!",
      text: `Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn trên Surprise Message. Để tiếp tục quá trình này, vui lòng sử dụng mã OTP bên dưới. \n\nMã OTP của bạn là ${otp}\n\nNếu bạn không thực hiện yêu cầu này, vui lòng liên hệ cho chúng tôi ngay lập tức.`,
      html: `<p>Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn trên Surprise Message. Để tiếp tục quá trình này, vui lòng sử dụng mã OTP bên dưới. <br/><br/>Mã OTP của bạn là <b>${otp}</b><br/><br/>Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ cho chúng tôi ngay lập tức.</p>`
    });
  });

  it("should handle error when sending OTP for user", async () => {
    const otp = "123456";
    const toEmail = "test@example.com";
    const errorMessage = "Error sending OTP";
    const sendMailMock = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    nodemailer.createTransport.mockReturnValueOnce({ sendMail: sendMailMock });
    const result = await sendOTPForUser(otp, toEmail);
    expect(result).toEqual({ EC: 1, EM: errorMessage, DT: "" });
  });

  it("should handle error when sending OTP for forgot password", async () => {
    const otp = "123456";
    const toEmail = "test@example.com";
    const errorMessage = "Error sending OTP";
    const sendMailMock = jest.fn().mockRejectedValueOnce(new Error(errorMessage));
    nodemailer.createTransport.mockReturnValueOnce({ sendMail: sendMailMock });
    const result = await sendOTPForgotPassword(otp, toEmail);
    expect(result).toEqual({ EC: 1, EM: errorMessage, DT: "" });
  });
});
