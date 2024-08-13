import { PickType } from '@nestjs/mapped-types/dist';
import { MovieDetail } from '../entities/movie-detail.entity';

export class MovieDetailDto extends PickType(MovieDetail, [
  'movieTitle',
  'movieDirector',
  'movieOpenDate',
  'movieDescription',
]) {
  moviePoster: string[];
}
