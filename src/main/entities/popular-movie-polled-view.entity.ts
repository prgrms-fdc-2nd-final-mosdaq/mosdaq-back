import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity('popular_movie_polled_view')
export class PopularMoviePolledView {
  @ViewColumn({ name: 'movie_id' })
  movieId: number;

  @ViewColumn({ name: 'movie_title' })
  movieTitle: string;

  @ViewColumn({ name: 'movie_open_date' })
  movieOpenDate: Date;

  @ViewColumn({ name: 'country' })
  country: string;

  @ViewColumn({ name: 'before_price' })
  beforePrice: number;

  @ViewColumn({ name: 'after_price' })
  afterPrice: number;

  @ViewColumn({ name: 'before_date' })
  beforeDate: Date;

  @ViewColumn({ name: 'after_date' })
  afterDate: Date;

  @ViewColumn({ name: 'up_polls' })
  upPolls: number;
  @ViewColumn({ name: 'down_polls' })
  downPolls: number;

  @ViewColumn({ name: 'poll_count' })
  pollCount: number;

  @ViewColumn({ name: 'movie_poster' })
  moviePoster: string;
}
