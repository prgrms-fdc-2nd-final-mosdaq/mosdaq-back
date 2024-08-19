import { ViewEntity, ViewColumn } from 'typeorm';

// TODO: mosdaq-data 에서 main_movie_view 변경 이후 적용
@ViewEntity({ name: 'main_movie_view_to_be' })
// @ViewEntity({ name: 'main_movie_view' })
export class MainMovieView {
  @ViewColumn({ name: 'movie_id' })
  movieId: number;

  @ViewColumn({ name: 'movie_title' })
  movieTitle: string;

  @ViewColumn({ name: 'eight_weeks_before_price' })
  eightWeeksBeforePrice: number;

  @ViewColumn({ name: 'eight_weeks_after_price' })
  eightWeeksAfterPrice: number;

  @ViewColumn({ name: 'four_weeks_before_price' })
  fourWeeksBeforePrice: number;

  @ViewColumn({ name: 'four_weeks_after_price' })
  fourWeeksAfterPrice: number;

  @ViewColumn({ name: 'movie_open_date_stock_price' })
  movieOpenDateStockPrice: number;

  @ViewColumn({ name: 'movie_open_date_stock_date' })
  movieOpenDateStockDate: Date;

  @ViewColumn({ name: 'four_weeks_before_date' })
  fourWeeksBeforeDate: Date;

  @ViewColumn({ name: 'four_weeks_after_date' })
  fourWeeksAfterDate: Date;

  @ViewColumn({ name: 'eight_weeks_before_date' })
  eightWeeksBeforeDate: Date;

  @ViewColumn({ name: 'eight_weeks_after_date' })
  eightWeeksAfterDate: Date;

  @ViewColumn({ name: 'movie_poster' })
  moviePoster: string;

  @ViewColumn({ name: 'country' })
  country: string;

  @ViewColumn({ name: 'company_name' })
  companyName: string;
}
