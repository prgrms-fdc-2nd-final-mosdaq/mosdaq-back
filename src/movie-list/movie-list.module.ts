import { Module } from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import { MovieListController } from './movie-list.controller';

@Module({
  controllers: [MovieListController],
  providers: [MovieListService],
})
export class MovieListModule {}
