import { ViewEntity, ViewColumn, Column } from 'typeorm';

@ViewEntity('popular_movie_polling_view')
export class PopularMoviePollingView {
  @ViewColumn()
  @Column({ name: 'movie_id', type: 'int' })
  movieId: number;

  @ViewColumn()
  @Column({ name: 'movie_title', type: 'character varying', length: 150 })
  movieTitle: string;

  @ViewColumn()
  @Column({ name: 'movie_open_date', type: 'date' })
  movieOpenDate: Date;

  @ViewColumn()
  @Column({ name: 'up_polls', type: 'int' })
  upPolls: number;

  @ViewColumn()
  @Column({ name: 'down_polls', type: 'int' })
  downPolls: number;

  @ViewColumn()
  @Column({ name: 'poll_count', type: 'int' })
  pollCount: number;

  @ViewColumn()
  @Column({ name: 'movie_poster', type: 'text' })
  moviePoster: string;
}
