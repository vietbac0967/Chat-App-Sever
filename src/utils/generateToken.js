import jwt from "jsonwebtoken";
import { client } from "../config/connectToRedis.js";
export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
};

export const generateRefreshToken = async (id) => {
  const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "365d",
  });
  await client.set(
    id.toString(),
    refreshToken,
    { EX: 365 * 24 * 60 * 60 },
    (err, reply) => {
      if (err) {
        console.log("err:", err);
      }
      console.log("reply:", reply);
    }
  );
  return refreshToken;
};
