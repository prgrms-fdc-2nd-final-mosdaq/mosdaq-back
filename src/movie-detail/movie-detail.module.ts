import { Module } from '@nestjs/common';
import { MovieDetailService } from './movie-detail.service';
import { MovieDetailController } from './movie-detail.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from 'src/poll/entities/movie.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie])],
  controllers: [MovieDetailController],
  providers: [MovieDetailService],
})
export class MovieDetailModule {}
