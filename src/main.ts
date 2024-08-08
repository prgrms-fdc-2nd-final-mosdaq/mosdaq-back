import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger/setupSwagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // TODO: 프론트도 AWS 배포 이후에는 cors 조건 한정시키는 것으로 변경!
  const allowedOrigins = [''];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  setupSwagger(app);

  // TODO: config/configuration.ts로 처리
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
