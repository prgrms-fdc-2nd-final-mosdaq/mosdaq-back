import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({ name: 'main_movie_view' })
export class MainMovieView {
  @ViewColumn()
  movie_id: number;

  @ViewColumn()
  movie_title: string;

  @ViewColumn()
  before_price: number;

  @ViewColumn()
  after_price: number;

  @ViewColumn()
  before_date: string;

  @ViewColumn()
  after_date: string;

  @ViewColumn()
  movie_poster: string;

  @ViewColumn()
  country: string;
}