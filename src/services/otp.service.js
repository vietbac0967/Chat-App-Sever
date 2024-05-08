import OTP from "../models/otp.model.js";
import bcrypt from "bcrypt";
const insertOTP = async (otp, email) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashOTP = await bcrypt.hash(otp, salt);
    const Otp = OTP.create({ email, otp: hashOTP });
    return Otp ? 1 : 0;
  } catch (error) {
    return { message: error.message };
  } 
};
const validateOTP = async ({ otp, hashOTP }) => {
  try {
    const isValid = await bcrypt.compare(otp, hashOTP);
    return isValid;
  } catch (error) {
    console.log({ message: error.message });
    return { message: error.message };
  }
};
export { insertOTP ,validateOTP};
