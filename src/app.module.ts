// src/app.module.ts
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
import dbConfig from './config/dbConfig';
import { validationSchema } from './config/validationSchema';

import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    MainModule,
    MovieQuizModule,
    AuthModule,
    UsersModule,
    PollModule,
    MovieListModule,
    StocksModule,
    MovieDetailModule,
    ConfigModule.forRoot({
      envFilePath: [
        `${__dirname}/config/env/.env.${process.env.NODE_ENV}.local`,
      ],
      load: [dbConfig],
      isGlobal: true, // Makes the ConfigModule globally available
      validationSchema,
      // 전역이라 provider에 configService 주입 없이 사용 가능.
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigType<typeof dbConfig>) => {
        console.log('Database Config:', {
          host: config.dbHost,
          port: config.dbPort,
          username: config.dbUser,
          password: config.dbPassword,
          database: config.database,
        });
        return {
          type: 'postgres',
          host: config.dbHost,
          port: parseInt(config.dbPort, 10), // dbPort is a string, so convert to number
          username: config.dbUser,
          password: config.dbPassword,
          database: config.database,
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
        };
      },
      inject: [dbConfig.KEY],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
