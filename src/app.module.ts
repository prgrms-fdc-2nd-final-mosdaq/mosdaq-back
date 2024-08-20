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
import { StocksModule } from './stocks/stocks.module';
import { MovieDetailModule } from './movie-detail/movie-detail.module';
import { Company } from './stocks/entities/company.entity';
import { Stock } from './stocks/entities/stock.entity';
import * as winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';

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
          Company,
          Stock,
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(), // 로그 남긴 시각 표시
            utilities.format.nestLike('MyApp', {
              // 로그 출처인 appName('MyApp') 설정
              prettyPrint: true,
            }),
          ),
        }),
      ],
    }),
    MainModule,
    MovieQuizModule,
    AuthModule,
    UsersModule,
    PollModule,
    MovieListModule,
    StocksModule,
    MovieDetailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
