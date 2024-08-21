import { ViewEntity, ViewColumn } from 'typeorm';

// TODO: main_movie_view로 변경
@ViewEntity({ name: 'main_movie_view_to_be' })
export class MainMovieView {
  @ViewColumn({ name: 'movie_id' })
  movieId: number;

  @ViewColumn({ name: 'movie_title' })
  movieTitle: string;

  @ViewColumn({ name: 'movie_open_date' })
  movieOpenDate: string;

  @ViewColumn({ name: 'company_name' })
  companyName: string;

  @ViewColumn({ name: 'country' })
  country: string;

  @ViewColumn({ name: 'movie_poster' })
  moviePoster: string;
}
