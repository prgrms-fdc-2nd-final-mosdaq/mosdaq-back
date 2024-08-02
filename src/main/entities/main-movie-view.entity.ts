import { ViewEntity, ViewColumn, Column } from 'typeorm';

@ViewEntity({ name: 'main_movie_view' })
export class MainMovieView {
  @ViewColumn()
  @Column({ type: 'int' })
  movie_id: number;

  @ViewColumn()
  @Column({ type: 'character varying', length: 150 })
  movie_title: string;

  @ViewColumn()
  @Column({ type: 'numeric' })
  before_price: number;

  @ViewColumn()
  @Column({ type: 'numeric' })
  after_price: number;

  @ViewColumn()
  @Column({ type: 'date' })
  before_date: Date;

  @ViewColumn()
  @Column({ type: 'date' })
  after_date: Date;

  @ViewColumn()
  @Column({ type: 'text' })
  movie_poster: string;

  @ViewColumn()
  @Column({ type: 'char', length: 3 })
  country: string;
}
