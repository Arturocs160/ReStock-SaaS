import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: isDev
    ? { target: 'pino-pretty', options: { colorize: true, singleLine: false } }
    : undefined,
  base: { service: 'ReStock-API' },
  timestamp: pino.stdTimeFunctions.isoTime
});

export default logger;
