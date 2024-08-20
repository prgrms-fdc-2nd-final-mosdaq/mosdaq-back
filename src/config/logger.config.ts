// config/logger.config.ts

import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
// import winstonDaily from 'winston-daily-rotate-file';
import 'winston-daily-rotate-file'; // 모듈을 단순히 가져옴

import * as winston from 'winston';

// TODO: configService.get<string>('NODE_ENV'),
const isProduction = process.env['NODE_ENV'] === 'production';
const logDir = __dirname + '/../../logs';

const dailyOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: isProduction ? 'info' : 'silly',
      format: isProduction
        ? winston.format.simple()
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Mosdaq', {
              colors: true,
              prettyPrint: true,
            }),
          ),
    }),
    new winston.transports.DailyRotateFile(dailyOptions('info')),
    new winston.transports.DailyRotateFile(dailyOptions('warn')),
    new winston.transports.DailyRotateFile(dailyOptions('error')),
  ],
});
