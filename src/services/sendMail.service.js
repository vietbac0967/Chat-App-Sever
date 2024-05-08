import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.GMAIL_AUTH, // generated ethereal user
    pass: process.env.KEY_GMAIL_SECRET, // generated ethereal password
  },
});
export const sendOTPForUser = async (otp, toEmail) => {
  try {
    transporter.sendMail({
      from: { name: "Surprise Message", address: "testingmtt2808@gmail.com" }, // sender address
      to: toEmail, // list of receivers
      subject:
        "Xác nhận đăng ký tài khoản thành công!", // Subject line
      text: `Bạn đã tạo tài khoản thành công trên Surprise Message. Dưới đây là mã OTP để hoàn tất quá trình đăng ký. \n\nMã OTP của bạn là ${otp}`, // plain text body
      html: `<p>Bạn đã tạo tài khoản thành công trên Surprise Message. Dưới đây là mã OTP để hoàn tất quá trình đăng ký. <br/><br/>Mã OTP của bạn là <b>${otp}</b></p>`, // html body
    });
    return { EC: 0, EM: "Success", DT: otp };
  } catch (error) {
    return { EC: 1, EM: error.message, DT: "" };
  }
};

export const sendOTPForgotPassword = async (otp, toEmail) => {
  try {
    transporter.sendMail({
      from: { name: "Surprise Message", address: "testingmtt2808@gmail.com" }, // sender address
      to: toEmail, // list of receivers
      subject:
        "Yêu cầu khôi phục mật khẩu thành công!", // Subject line
      text: `Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn trên Surprise Message. Để tiếp tục quá trình này, vui lòng sử dụng mã OTP bên dưới. \n\nMã OTP của bạn là ${otp}\n\nNếu bạn không thực hiện yêu cầu này, vui lòng liên hệ cho chúng tôi ngay lập tức.`, // plain text body
      html: `<p>Chúng tôi đã nhận được yêu cầu khôi phục mật khẩu cho tài khoản của bạn trên Surprise Message. Để tiếp tục quá trình này, vui lòng sử dụng mã OTP bên dưới. <br/><br/>Mã OTP của bạn là <b>${otp}</b><br/><br/>Nếu bạn không thực hiện yêu cầu này, vui lòng liên hệ cho chúng tôi ngay lập tức.</p>`, // html body
    });
    return { EC: 0, EM: "Success", DT: otp };
  } catch (error) {
    return { EC: 1, EM: error.message, DT: "" };
  }
};
