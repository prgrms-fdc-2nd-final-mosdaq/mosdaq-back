import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MainMovieView } from './entities/main-movie-view.entity';
import { PopularMoviePollingView } from './entities/popular-movie-polling-view.entity';
import { PopularMoviePolledView } from './entities/popular-movie-polled-view.entity';
import { PopularMoviesPolledResponseDto } from './dto/popular-movie-polled-response.dto';
import {
  POPULAR_MOVIE_POLLED_COUNT,
  POPULAR_MOVIE_POLLING_COUNT,
} from 'src/constants/app.constants';
import { getYYYYMMDDDate } from 'src/util/date';
import { MainMovieResponseDto } from './dto/main-movie-response.dto';
import { PopularMoviesPollingResponseDto } from './dto/popular-movie-polling-response.dto';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(MainMovieView)
    private mainMovieRepository: Repository<MainMovieView>,

    @InjectRepository(PopularMoviePollingView)
    private popularMoviePollingRepository: Repository<PopularMoviePollingView>,

    @InjectRepository(PopularMoviePolledView)
    private readonly popularMoviePolledRepository: Repository<PopularMoviePolledView>,
  ) {}

  async getMainMovies(): Promise<MainMovieResponseDto> {
    try {
      const movieList = await this.mainMovieRepository.find();

      const movieListWithStockData = await Promise.all(
        movieList.map(async (movie) => {
          const movieId = movie.movieId;

          try {
            const stockPriceList = await this.mainMovieRepository
              .createQueryBuilder('m')
              .select(['stock.stock_date', 'stock.close_price'])
              .innerJoin(
                'company',
                'company',
                'company.company_name = m.company_name',
              )
              .innerJoin(
                'stock',
                'stock',
                `stock.ticker_name = company.ticker_name 
                 AND stock.stock_date BETWEEN m.movie_open_date - INTERVAL '4 weeks' 
                 AND m.movie_open_date + INTERVAL '4 weeks'`,
              )
              .where('m.movie_id = :movieId', { movieId })
              .getRawMany();

            return {
              movieId: movie.movieId,
              movieTitle: movie.movieTitle,
              moviePoster: movie.moviePoster.split('|'),
              country: movie.country.trim(),
              companyName: movie.companyName,
              stockPriceList: stockPriceList.map((stock) => ({
                price: Number(stock.close_price),
                date: getYYYYMMDDDate(stock.stock_date),
              })),
            };
          } catch (err) {
            console.error('Error fetching stock data for movie:', err);
            throw new HttpException(
              '영화 관련 주식 데이터를 가져오는데 실패했습니다.',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          }
        }),
      );

      return {
        movieList: movieListWithStockData.map((movie) => ({
          movieId: movie.movieId,
          movieTitle: movie.movieTitle,
          posterUrl: movie.moviePoster,
          countryCode: movie.country,
          companyName: movie.companyName,
          stockPriceList: movie.stockPriceList,
        })),
        movieListCount: movieList.length,
      };
    } catch (err) {
      // TODO: 에러 핸들링 통일
      console.error('Error fetching main movies:', err);
      throw new HttpException(
        '대표 영화 5개를 가져오는데 실패 하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPopularMoviesPolling(
    userId: number | null,
  ): Promise<PopularMoviesPollingResponseDto> {
    try {
      const queryBuilder = this.popularMoviePollingRepository
        .createQueryBuilder('pmv')
        .leftJoinAndSelect(
          'poll',
          'p',
          'pmv.movie_id = p.fk_movie_id AND p.fk_user_id = :userId',
          { userId },
        )
        .select([
          'pmv.movie_id AS movieId',
          'pmv.movie_title AS movieTitle',
          'pmv.up_polls AS up',
          'pmv.down_polls AS down',
          "CASE WHEN p.poll_flag IS TRUE THEN 'up' WHEN p.poll_flag IS FALSE THEN 'down' ELSE NULL END AS myPollResult",
          'pmv.movie_poster AS posterUrl',
          'pmv.poll_count AS pollCount',
        ])
        .orderBy('pmv.poll_count', 'DESC')
        .addOrderBy('pmv.movie_open_date', 'ASC')
        .limit(POPULAR_MOVIE_POLLING_COUNT);

      // TODO: queryBuilder.getRawMany() 이후 movietitle 처럼 camelCase로 안나오는 이슈 해결
      const movieList = await queryBuilder.getRawMany();

      return {
        movieList: movieList.map((movie) => ({
          movieId: Number(movie.movieid),
          movieTitle: movie.movietitle,
          posterUrl: movie.posterurl.split('|'),
          up: Number(movie.up),
          down: Number(movie.down),
          myPollResult: userId ? movie.mypollresult : null,
        })),
        movieListCount: movieList.length,
      };
    } catch (err) {
      // TODO: 에러 핸들링 통일
      console.error('Error fetching popular polling movies:', err);
      throw new HttpException(
        `투표 중인 영화 목록을 가져오는데 실패 하였습니다.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TODO: 투표 수가 0일때 '0'으로 가져와지고 그로인하여 결과가 null로 나오는 이슈 해결 필요
  async getPopularMoviesPolled(): Promise<PopularMoviesPolledResponseDto> {
    try {
      const queryBuilder: SelectQueryBuilder<PopularMoviePolledView> =
        this.popularMoviePolledRepository
          .createQueryBuilder('p')
          .orderBy('p.movieOpenDate', 'DESC')
          .limit(POPULAR_MOVIE_POLLED_COUNT);

      const movies = await queryBuilder.getMany();

      const movieList = movies.map((movie) => ({
        movieId: Number(movie.movieId),
        posterUrl: movie.moviePoster.split('|'),
        movieTitle: movie.movieTitle,
        up: Number(movie.upPolls),
        down: Number(movie.downPolls),
        countryCode: movie.country.trim(),
        // TODO: companyName 포함
        beforePrice: Number(movie.beforePrice),
        afterPrice: Number(movie.afterPrice),
        beforePriceDate: getYYYYMMDDDate(movie.beforeDate),
        afterPriceDate: getYYYYMMDDDate(movie.afterDate),
      }));

      return { movieList, movieListCount: movieList.length };
    } catch (err) {
      console.error('Error fetching popular polled movies:', err);
      throw new HttpException(
        '투표 마감된 영화 목록을 가져오는데 실패 하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
