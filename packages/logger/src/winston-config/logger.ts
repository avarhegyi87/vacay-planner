import winston from 'winston';
import logdnaWinston from 'logdna-winston';
import ip from 'ip'

const logDNAOptions = {
  key: process.env.LOGDNA_KEY,
  hostname: 'localhost',
  ip: ip.address(),
  app: 'Typescript-Node',
  env: 'development',
  indexMeta: true
}

const logLevel: string = process.env.LOG_LEVEL ?? process.env.NODE_ENV === 'production' ? 'error' : 'debug';

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({level: logLevel}),
    new winston.transports.File({filename: 'debug.log', level: 'debug'}),
  ],
}

const logger = winston.createLogger(options);
options.handleExceptions = true;
logger.add(new logdnaWinston(logDNAOptions))

logger.debug(`Logging initialised at ${logLevel} level`);

export default logger;
