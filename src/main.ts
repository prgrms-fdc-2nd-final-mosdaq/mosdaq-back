import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger/setupSwagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  /** TODO:
   * - 프론트도 AWS 배포 이후에는 cors 조건 한정시키는 것으로 변경!
   * - https 처리
   * - 'http://localhost:3000' 항목 있어야만 하는지 확인
   */
  const allowedOrigins = [
    configService.get<number>('CORS_ORIGIN'),
    'http://localhost:3000',
    'http://mosdaq.site:8080',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin); // 요청 도메인을 Access-Control-Allow-Origin 헤더에 설정
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // 자격 증명 허용
  });

  setupSwagger(app);

  // TODO: config/configuration.ts로 처리
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
