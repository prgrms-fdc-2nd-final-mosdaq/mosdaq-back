import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MainMovieView } from './entities/main-movie-view.entity';
import { PopularMoviePollingView } from './entities/popular-movie-polling-view.entity';
import { PopularMoviePolledView } from './entities/popular-movie-polled-view.entity';

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(MainMovieView)
    private mainMovieRepository: Repository<MainMovieView>,
    @InjectRepository(PopularMoviePollingView)
    private popularMoviePollingRepository: Repository<PopularMoviePollingView>,
    @InjectRepository(PopularMoviePolledView)
    private popularMoviePolledRepository: Repository<PopularMoviePolledView>,
  ) {}

  async getMainMovies(): Promise<any> {
    try {
      const movieList = await this.mainMovieRepository.find();
      return {
        movieList: movieList.map((movie) => ({
          movieId: movie.movie_id,
          movieTitle: movie.movie_title,
          posterUrl: movie.movie_poster,
          countryCode: movie.country,
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
            ? (parseInt(movie.up, 10) / parseInt(movie.pollcount, 10)) * 100
            : 0,
          down: parseInt(movie.pollcount, 10)
            ? (parseInt(movie.down, 10) / parseInt(movie.pollcount, 10)) * 100
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

  async getPopularMoviesPolled(): Promise<any> {
    try {
      const movieList = await this.popularMoviePolledRepository.find();
      return {
        movieList: movieList.map((movie) => ({
          movieId: movie.movieId,
          movieTitle: movie.movieTitle,
          posterUrl: movie.moviePoster,
          countryCode: movie.country,
          beforePrice: movie.beforePrice,
          afterPrice: movie.afterPrice,
          beforePriceDate: movie.beforeDate,
          afterPriceDate: movie.afterDate,
          up: movie.upPolls,
          down: movie.downPolls,
          pollCount: movie.pollCount,
        })),
        movieListCount: movieList.length,
      };
    } catch (err) {
      console.error('Error fetching popular polled movies:', err);
      throw new HttpException(
        '투표 중인 영화 목록을 가져오는데 실패 하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
