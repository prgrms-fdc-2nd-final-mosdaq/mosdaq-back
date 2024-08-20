// common/middleware/logger-context.middleware.ts
import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly jwt: JwtService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl, headers } = req;
    const userAgent = req.get('user-agent');
    // const payload = headers.authorization
    //   ? this.jwt.decode(headers.authorization)
    //   : null;
    // const userId = payload ? payload.sub : 0;
    const userId = 'mosdaq';
    const datetime = new Date();
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `${datetime} USER-${userId} ${method} ${originalUrl} ${statusCode} ${ip} ${userAgent}`,
      );
    });

    next();
  }
}
