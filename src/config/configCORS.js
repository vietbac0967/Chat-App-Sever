import cors from "cors";
// require("dotenv").config();
import dotenv from "dotenv";
dotenv.config();
export const configCORS = (app) => {
  app.use(function (req, res, next) {
    // let allowedDomains = [process.env.URL_WEB,"http://localhost:8081"];
    // let allowedDomains = "*";
    // let origin = req.headers.origin;
    // if (allowedDomains.indexOf(origin) > -1) {
    // }

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", true);
    res.header("Access-Control-Allow-Credentials", true);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    next();
  });
};
