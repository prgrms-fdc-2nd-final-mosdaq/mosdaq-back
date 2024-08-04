import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MainMovieView } from './main/entities/main-movie-view.entity';
import { MainModule } from './main/main.module';
import { MovieQuizModule } from './movie-quiz/movie-quiz.module';
import { MovieQuiz } from './movie-quiz/entities/movie-quiz.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigModule globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        entities: [MainMovieView, MovieQuiz],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    MainModule,
    MovieQuizModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
