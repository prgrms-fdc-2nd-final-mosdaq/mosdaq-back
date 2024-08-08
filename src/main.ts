import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger/setupSwagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupSwagger(app);

  const corsOptions = {
    origin: configService.get<string>('CORS_ORIGIN') || 'http://localhost:5173',
    credentials: true,
  };

  app.enableCors(corsOptions);

  // TODO: config/configuration.ts로 처리
  await app.listen(configService.get<number>('PORT') || 3000);
}
bootstrap();
