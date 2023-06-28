import winston from 'winston';
const { combine, timestamp, label, printf, prettyPrint, simple } =
  winston.format;
import cliColor from 'cli-color';

const createLogger = (name: string) => {
  const colorizer = cliColor;
  const logger = winston.createLogger({
    format: combine(
      label({ label: name }),
      timestamp({
        format: 'MMM-DD-YYYY HH:mm:ss',
      }),

      printf(({ level, timestamp, message }) => {
        let levelTag;
        switch (level) {
          case 'info':
            levelTag = colorizer.green('INFO:');
            break;
          case 'error':
            levelTag = colorizer.red('ERR:');
            break;
          default:
            levelTag = colorizer.green('INFO:');
            break;
        }
        return `${levelTag} ${timestamp} [${name}]: ${message}`;
      }),
    ),
    transports: [new winston.transports.Console()],
  });
  return logger;
};
export default createLogger;
