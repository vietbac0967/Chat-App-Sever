import mongoose from "mongoose";

// Set the default timezone
const otpModel = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: String,
  timeOTP: {
    type: Date,
    default: Date.now, 
    expires: "2m", 
  },
});

const OTP = mongoose.model("OTP", otpModel);
export default OTP;
