// 📄 src/movies/dto/popular-movies-polled-response.dto.ts
import { Expose } from 'class-transformer';

export class PopularMoviePolledMovieDto {
  @Expose()
  movieId: number;

  @Expose()
  posterUrl: string;

  @Expose()
  movieTitle: string;

  @Expose()
  up: number;

  @Expose()
  down: number;

  @Expose()
  countryCode: string;

  @Expose()
  beforePrice: number;

  @Expose()
  afterPrice: number;

  @Expose()
  beforePriceDate: string; // ISO format date string

  @Expose()
  afterPriceDate: string; // ISO format date string
}

export class PopularMoviesPolledResponseDto {
  @Expose()
  movieList: PopularMoviePolledMovieDto[];

  @Expose()
  movieListCount: number;
}
