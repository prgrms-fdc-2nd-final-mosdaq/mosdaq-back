import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity('popular_movie_polling_view')
export class PopularMoviePollingView {
  @ViewColumn({ name: 'movie_id' })
  movieId: number;

  @ViewColumn({ name: 'movie_title' })
  movieTitle: string;

  @ViewColumn({ name: 'movie_open_date' })
  movieOpenDate: Date;

  @ViewColumn({ name: 'movie_poster' })
  moviePoster: string;

  @ViewColumn({ name: 'up_polls' })
  upPolls: number;

  @ViewColumn({ name: 'down_polls' })
  downPolls: number;

  @ViewColumn({ name: 'poll_count' })
  pollCount: number;
}
