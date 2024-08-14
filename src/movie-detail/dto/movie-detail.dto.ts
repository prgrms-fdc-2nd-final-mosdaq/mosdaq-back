import { PickType } from '@nestjs/mapped-types/dist';
import { Movie } from 'src/poll/entities/movie.entity';

export class MovieDetailDto extends PickType(Movie, [
  'movieTitle',
  'movieDirector',
  'movieOpenDate',
  'movieDescription',
]) {
  moviePoster: string[];
}
