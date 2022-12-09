import { createLogger, format, transports } from "winston";

const { printf, combine, colorize, timestamp, errors } = format;

const devLogFormat = printf((log) => {
  let msg = `${log.timestamp} ${log.level}: ${
    log.stack || typeof log.message === "object"
      ? JSON.stringify(log.message)
      : log.message
  }`;
  if (log.stack) {
    msg += log.stack;
  }
  return msg;
});
const logger = createLogger({
  level: "verbose",
  format: combine(
    colorize(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    devLogFormat
  ),
  transports: [new transports.Console()],
});

export default logger;
