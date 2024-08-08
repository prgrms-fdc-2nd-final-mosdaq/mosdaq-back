import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MainMovieView } from './entities/main-movie-view.entity';
import { PopularMoviePollingView } from './entities/popular-movie-polling-view.entity';
import { PopularMoviePolledView } from './entities/popular-movie-polled-view.entity';
import { PopularMoviesPolledResponseDto } from './dto/popular-movie-polled-response.dto';
import { format } from 'date-fns';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(MainMovieView)
    private readonly mainMovieRepository: Repository<MainMovieView>,
    @InjectRepository(PopularMoviePollingView)
    private readonly popularMoviePollingRepository: Repository<PopularMoviePollingView>,
    @InjectRepository(PopularMoviePolledView)
    private readonly popularMoviePolledRepository: Repository<PopularMoviePolledView>,
  ) {}

  // TODO: Promise<any> => Promise<DTO>
  async getMainMovies(): Promise<any> {
    try {
      const movieList = await this.mainMovieRepository.find();
      return {
        movieList: movieList.map((movie) => ({
          movieId: movie.movie_id,
          movieTitle: movie.movie_title,
          posterUrl: movie.movie_poster,
          countryCode: movie.country.trim(),
          beforePrice: movie.before_price,
          afterPrice: movie.after_price,
          beforePriceDate: movie.before_date,
          afterPriceDate: movie.after_date,
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

  async getPopularMoviesPolling(userId: number | null): Promise<any> {
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
        .limit(5);

      // TODO: queryBuilder.getRawMany() 이후 movietitle 처럼 camelCase로 안나오는 이슈 해결
      const movieList = await queryBuilder.getRawMany();

      console.log('# Query Result : ', movieList);

      return {
        movieList: movieList.map((movie) => ({
          movieId: parseInt(movie.movieid, 10),
          movieTitle: movie.movietitle,
          posterUrl: movie.posterurl,
          up: parseInt(movie.pollcount, 10)
            ? Math.round(
                (parseInt(movie.up, 10) / parseInt(movie.pollcount, 10)) * 100,
              )
            : 0,
          down: parseInt(movie.pollcount, 10)
            ? Math.round(
                (parseInt(movie.down, 10) / parseInt(movie.pollcount, 10)) *
                  100,
              )
            : 0,
          pollCount: parseInt(movie.pollcount, 10) || 0,
          myPollResult: userId ? movie.mypollresult : null,
        })),
        movieListCount: movieList.length,
      };
    } catch (err) {
      // TODO: 에러 핸들링 통일
      console.error('Error fetching popular polling movies:', err);
      throw new HttpException(
        '투표 중인 가장 투표가 많은 영화 5개를 가져오는데 실패 하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPopularMoviesPolled(): Promise<PopularMoviesPolledResponseDto> {
    try {
      const POPULAR_MOVIE_POLLED_COUNT = 5;

      const queryBuilder = this.popularMoviePolledRepository
        .createQueryBuilder('p')
        .select([
          'p.movieId AS movieId',
          'p.moviePoster AS moviePoster',
          'p.movieTitle AS movieTitle',
          'COALESCE(p.upPolls, 0) AS upPolls',
          'COALESCE(p.downPolls, 0) AS downPolls',
          'COALESCE(p.pollCount, 0) AS pollCount',
          'p.country AS country',
          'p.beforePrice AS beforePrice',
          'p.afterPrice AS afterPrice',
          'p.beforeDate AS beforeDate',
          'p.afterDate AS afterDate',
        ])
        .orderBy('p.movieOpenDate', 'DESC')
        .limit(POPULAR_MOVIE_POLLED_COUNT);

      // const queryBuilder = this.popularMoviePolledRepository
      //   .createQueryBuilder('p')
      //   .select([
      //     'p.movieId',
      //     'p.moviePoster',
      //     'p.movieTitle',
      //     'COALESCE(p.upPolls, 0) AS upPolls',
      //     'COALESCE(p.downPolls, 0) AS downPolls',
      //     'COALESCE(p.pollCount, 0) AS pollCount',
      //     'p.country AS country',
      //     'p.beforePrice',
      //     'p.afterPrice',
      //     'p.beforeDate',
      //     'p.afterDate',
      //   ])
      //   .orderBy('p.movieOpenDate', 'DESC')
      //   .limit(POPULAR_MOVIE_POLLED_COUNT);

      // const queryBuilder: SelectQueryBuilder<PopularMoviePolledView> =
      //   this.popularMoviePolledRepository
      //     .createQueryBuilder('p')
      //     .orderBy('p.movieOpenDate', 'DESC')
      //     .limit(POPULAR_MOVIE_POLLED_COUNT);

      // const movies = await queryBuilder.getRawMany();
      const movies = await queryBuilder.getMany();

      console.log('Query Result : ', movies);

      const movieList = movies.map((movie) => ({
        movieId: Number(movie.movieid),
        posterUrl: String(movie.movieposter),
        movieTitle: String(movie.movietitle),
        up:
          movie.pollcount && movie.uppolls !== null
            ? Math.round(Number((movie.uppolls / movie.pollcount) * 100))
            : 0,
        down:
          movie.pollcount && movie.downpolls !== null
            ? Math.round(Number((movie.downpolls / movie.pollcount) * 100))
            : 0,
        countryCode: String(movie.country),
        beforePrice: Number(movie.beforeprice),
        afterPrice: Number(movie.afterprice),
        beforePriceDate: format(new Date(movie.beforedate), 'yyyy-MM-dd'),
        afterPriceDate: format(new Date(movie.afterdate), 'yyyy-MM-dd'),
      }));

      return { movieList, movieListCount: movieList.length };
    } catch (err) {
      console.error('Error fetching popular polled movies:', err);
      throw new HttpException(
        '투표 중인 영화 목록을 가져오는데 실패 하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*
  async getPopularMoviesPolled(): Promise<PopularMoviesPolledResponseDto> {
    try {
      // 투표 마감 영화 검색 최대 갯수
      const POPULAR_MOVIE_POLLED_COUNT = 5;

      const queryBuilder: SelectQueryBuilder<PopularMoviePolledView> =
        this.popularMoviePolledRepository
          .createQueryBuilder('p')
          .orderBy('p.movieOpenDate', 'DESC')
          .limit(POPULAR_MOVIE_POLLED_COUNT);

      const movies = await queryBuilder.getMany();

      console.log('Query Reulst : ', movies);

      // BUG, TODO: up, down, price 등은 number 타입인데 왜 json 응답 값에서는 string 타입인가?
      const movieList = movies.map((movie) => ({
        movieId: Number(movie.movieId),
        posterUrl: String(movie.moviePoster),
        movieTitle: String(movie.movieTitle),
        up:
          movie.pollCount && movie.upPolls !== null
            ? Number(((movie.upPolls / movie.pollCount) * 100).toFixed(2))
            : 0,
        down:
          movie.pollCount && movie.downPolls !== null
            ? Number(((movie.downPolls / movie.pollCount) * 100).toFixed(2))
            : 0,

        countryCode: String(movie.country.trim()),
        beforePrice: Number(movie.beforePrice),
        afterPrice: Number(movie.afterPrice),
        beforePriceDate: new Date(movie.beforeDate).toISOString(),
        afterPriceDate: new Date(movie.afterDate).toISOString(),
      }));

      return { movieList: movieList, movieListCount: movieList.length };
    } catch (err) {
      console.error('Error fetching popular polled movies:', err);
      throw new HttpException(
        '투표 중인 영화 목록을 가져오는데 실패 하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  */
}
