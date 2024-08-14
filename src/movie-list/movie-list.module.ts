import { Module } from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import { MovieListController } from './movie-list.controller';
import { Movie } from '../poll/entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MovieListController],
  providers: [MovieListService],
})
export class MovieListModule {}
