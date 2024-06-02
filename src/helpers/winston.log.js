import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import LokiTransport from "winston-loki";
const { combine, timestamp, printf, colorize } = winston.format;
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};
const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};
winston.addColors(colors);

const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console({
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      // Tell Winston that the logs must be colored
      colorize({ all: true }),
      // Define the format of the message showing the timestamp, the level and the message
      printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
    ),
  }),
  new DailyRotateFile({
    dirname: "logs",
    filename: "application-%DATE%.all.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "10m",
    maxFiles: "14d",
  }),
  new DailyRotateFile({
    dirname: "logs",
    filename: "application-%DATE%.error.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "error",
  }),
  new LokiTransport({
    labels: {
      app: "application",
    },
    host: "http://localhost:3100",
  }),
];
const logger = winston.createLogger({
  level: level(),
  levels,
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports,
});
export default logger;
