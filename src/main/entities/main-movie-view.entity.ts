import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'main_movie_view' })
export class MainMovieView {
  @ViewColumn({ name: 'movie_id' })
  movieId: number;

  @ViewColumn({ name: 'movie_title' })
  movieTitle: string;

  @ViewColumn({ name: 'before_price' })
  beforePrice: number;

  @ViewColumn({ name: 'after_price' })
  afterPrice: number;

  @ViewColumn({ name: 'before_date' })
  beforeDate: Date;

  @ViewColumn({ name: 'after_date' })
  afterDate: Date;

  @ViewColumn({ name: 'movie_poster' })
  moviePoster: string;

  @ViewColumn({ name: 'country' })
  country: string;
}
