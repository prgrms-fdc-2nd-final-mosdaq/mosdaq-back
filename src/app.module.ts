import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MainMovieView } from './main/entities/main-movie-view.entity';
import { PopularMoviePollingView } from './main/entities/popular-movie-polling-view.entity';
import { PopularMoviePolledView } from './main/entities/popular-movie-polled-view.entity';
import { MainModule } from './main/main.module';
import { MovieQuizModule } from './movie-quiz/movie-quiz.module';
import { MovieQuiz } from './movie-quiz/entities/movie-quiz.entity';
import { UsersModel } from './users/entities/users.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PollModule } from './poll/poll.module';
import { Poll } from './poll/entities/poll.entity';
import { Movie } from './poll/entities/movie.entity';
import { MovieListModule } from './movie-list/movie-list.module';
import { MovieDetailModule } from './movie-detail/movie-detail.module';

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
          Poll,
          Movie,
          MovieQuiz,
          MainMovieView,
          PopularMoviePollingView,
          PopularMoviePolledView,
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
    MovieListModule,
    MovieDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
