import { PickType } from '@nestjs/mapped-types/dist';
import { IsArray, IsString } from 'class-validator';
import { Movie } from 'src/poll/entities/movie.entity';

export class MovieDetailDto extends PickType(Movie, [
  'movieTitle',
  'movieDirector',
  'movieOpenDate',
  'movieDescription',
]) {
  @IsArray()
  posterUrl: string[];

  @IsString()
  companyName: string;
}
