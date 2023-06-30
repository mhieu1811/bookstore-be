import winston from 'winston';
const { combine, timestamp, label, printf, colorize } = winston.format;

const createLogger = (name: string) => {
  const logger = winston.createLogger({
    format: combine(
      colorize(),
      label({ label: name }),
      timestamp({
        format: 'MMM-DD-YYYY HH:mm:ss',
      }),
      printf(({ level, timestamp, message }) => {
        return `${timestamp} [${name}] ${level}: ${message}`;
      }),
    ),
    transports: [new winston.transports.Console()],
  });
  return logger;
};
export default createLogger;
