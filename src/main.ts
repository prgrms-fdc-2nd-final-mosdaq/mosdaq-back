import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger/setupSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // TODO: origin 주소 config로 관리
    origin: 'http://localhost:5173', // 허용할 도메인
    credentials: true, // 자격 증명(쿠키, 인증 헤더 등) 사용
  });

  setupSwagger(app);

  // TODO: config/configuration.ts로 처리
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
