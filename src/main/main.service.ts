import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MainMovieView } from './entities/main-movie-view.entity';
import { PopularMoviePollingView } from './entities/popular-movie-polling-view.entity'; // 추가

@Injectable()
export class MainService {
  constructor(
    @InjectRepository(MainMovieView)
    private mainMovieRepository: Repository<MainMovieView>,
    @InjectRepository(PopularMoviePollingView)
    private popularMoviePollingRepository: Repository<PopularMoviePollingView>, // 추가
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

  async getPopularMoviePollings(userId: number | null): Promise<any> {
    // 추가
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
        ])
        .orderBy('pmv.poll_count', 'DESC')
        .addOrderBy('pmv.movie_open_date', 'ASC')
        .limit(5);

      const movieList = await queryBuilder.getRawMany();

      const upPolls = movieList.reduce(
        (sum, movie) => sum + movie.pmv_up_polls,
        0,
      );
      const downPolls = movieList.reduce(
        (sum, movie) => sum + movie.pmv_down_polls,
        0,
      );
      const totalPolls = upPolls + downPolls;

      return {
        movieList: movieList.map((movie) => ({
          movieId: movie.pmv_movie_id,
          movieTitle: movie.pmv_movie_title,
          posterUrl: movie.pmv_movie_poster,
          up: totalPolls ? (movie.up / totalPolls) * 100 : 0,
          down: totalPolls ? (movie.down / totalPolls) * 100 : 0,
          pollCount: movie.pmv_poll_count,
          myPollResult: userId ? (movie.p_pollFlag ? 'up' : 'down') : null,
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
}
