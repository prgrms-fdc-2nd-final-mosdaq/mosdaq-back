import { Column, ViewEntity } from 'typeorm';

@ViewEntity('popular_polling_movie_view')
export class PopularPollingMovieView {
  @Column({ name: 'movie_id' })
  movieId: number;

  @Column({ name: 'movie_title' })
  movieTitle: string;

  @Column({ name: 'vote_count' })
  voteCount: number;

  @Column({ name: 'poll_flag' })
  pollFlag: string;

  @Column({ name: 'movie_poster' }) // 추가: 영화 포스터 URL을 가져오기 위해 필요
  moviePoster: string;
}
