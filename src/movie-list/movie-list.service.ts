import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../poll/entities/movie.entity';
import {
  PollMovieDto,
  PollMovieListResponseDto,
} from './dto/poll-movie-list-response.dto';

@Injectable()
export class MovieListService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async getPollMovies(
    poll: boolean,
    offset: number,
    limit: number,
    sort: 'DESC' | 'ASC',
    userId: number | null,
  ): Promise<PollMovieListResponseDto> {
    try {
      const dateComparison: string = poll ? '>' : '<';

      const queryBuilder = this.movieRepository
        .createQueryBuilder('m')
        .leftJoinAndSelect('m.polls', 'p');

      if (userId !== null) {
        queryBuilder.andWhere('p.userId = :userId', { userId });
      }

      queryBuilder
        .where(`m.movieOpenDate ${dateComparison} CURRENT_DATE`)
        .orderBy('m.movieOpenDate', sort)
        .skip(offset)
        .take(limit);

      const movies = await queryBuilder.getMany();

      const movieList: PollMovieDto[] = movies.map((movie) => {
        const totalPolls = movie.polls.length;
        const upPolls = movie.polls.filter((poll) => poll.pollFlag).length;
        const downPolls = movie.polls.filter((poll) => !poll.pollFlag).length;

        // 백분율 계산
        const upPercentage =
          totalPolls > 0 ? Math.round((upPolls / totalPolls) * 100) : 0;
        const downPercentage =
          totalPolls > 0 ? Math.round((downPolls / totalPolls) * 100) : 0;

        // 나의 투표 결과를 찾아 설정 (userId가 존재하는 경우에만)
        const myPoll = movie.polls.find((poll) => poll.userId === userId);
        const myPollResult = myPoll ? (myPoll.pollFlag ? 'up' : 'down') : null;

        return {
          movieId: movie.movieId,
          movieTitle: movie.movieTitle,
          posterUrl: movie.moviePoster.split('|'),
          up: upPercentage,
          down: downPercentage,
          myPollResult,
        };
      });

      // 페이지네이션 계산
      const totalMoviesCount = await this.movieRepository
        .createQueryBuilder('m')
        .where(`m.movieOpenDate ${dateComparison} CURRENT_DATE`)
        .getCount();

      const currentPage = Math.floor(offset / limit) + 1;
      const totalPages = Math.ceil(totalMoviesCount / limit);

      return {
        movieList,
        movieListCount: movieList.length,
        pagination: {
          currentPage,
          totalPages,
        },
      };
    } catch (err) {
      console.error('Error executing query:', err);
      throw new InternalServerErrorException('Failed to retrieve movies.');
    }
  }
}
