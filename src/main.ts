import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger/setupSwagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); //cors 허용

  setupSwagger(app);

  // TODO: config/configuration.ts로 처리
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
