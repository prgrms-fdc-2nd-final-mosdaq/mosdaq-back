import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MainMovieView } from './main/entities/main-movie-view.entity';
import { PopularMoviePollingView } from './main/entities/popular-movie-polling-view.entity';
import { MainModule } from './main/main.module';
import { MovieQuizModule } from './movie-quiz/movie-quiz.module';
import { MovieQuiz } from './movie-quiz/entities/movie-quiz.entity';
import { UsersModel } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
<<<<<<< HEAD
import { PollModule } from './poll/poll.module';
=======
import { MovieDetailModule } from './movie-detail/movie-detail.module';
>>>>>>> 6b683574ab4a833c0c29a56ecbed184ad791a62d

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
        entities: [
          UsersModel,
          MovieQuiz,
          MainMovieView,
          PopularMoviePollingView,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    MainModule,
    MovieQuizModule,
    AuthModule,
    UsersModule,
    PollModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
