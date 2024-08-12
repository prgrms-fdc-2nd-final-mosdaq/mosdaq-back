import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MainMovieView } from './entities/main-movie-view.entity';
import { PopularMoviePollingView } from './entities/popular-movie-polling-view.entity';
import { PopularMoviePolledView } from './entities/popular-movie-polled-view.entity';
import { MainService } from './main.service';
import { MainController } from './main.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MainMovieView,
      PopularMoviePollingView,
      PopularMoviePolledView,
    ]),
  ],
  providers: [MainService],
  controllers: [MainController],
})
export class MainModule {}
