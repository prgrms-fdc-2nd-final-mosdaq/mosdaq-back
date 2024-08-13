import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieQuiz } from './entities/movie-quiz.entity';
import { Repository } from 'typeorm';
import * as dayjs from 'dayjs';
import { GetMovieQuizDto } from './dto/get-movie-quiz.dto';
import { MovieQuizDto } from './dto/movie-quiz.dto';

@Injectable()
export class MovieQuizService {
  constructor(
    @InjectRepository(MovieQuiz)
    private readonly movieQuizRepository: Repository<MovieQuiz>,
  ) {}

  async getRandomMovieQuiz(dto: GetMovieQuizDto): Promise<MovieQuizDto[]> {
    try {
      const currentDate = dayjs().format('YYYY-MM-DD');

      const quizzes = await this.movieQuizRepository
        .createQueryBuilder('movie_stock')
        .innerJoin('movie', 'movie', 'movie.movie_id = movie_stock.fk_movie_id')
        .innerJoin(
          'company',
          'company',
          'company.company_cd = movie_stock.fk_company_cd',
        )
        .select([
          'movie.movie_id',
          'movie.movie_title',
          'movie.movie_poster',
          'movie_stock.four_weeks_before_price',
          'movie_stock.four_weeks_after_price',
          'company.country',
        ])
        .where("movie.movie_open_date <= CURRENT_DATE - INTERVAL '30 days'")
        .orderBy('RANDOM()')
        .limit(dto.count)
        .getRawMany();

      return quizzes.map((quiz) => ({
        movieTitle: quiz.movie_title,
        moviePoster: quiz.movie_poster.split('|'),
        fourWeeksBeforePrice: +quiz.four_weeks_before_price,
        fourWeeksAfterPrice: +quiz.four_weeks_after_price,
        currency: quiz.country,
      }));
    } catch (err) {
      console.error('Error fetching main movies:', err);
      throw new HttpException(
        '영화 퀴즈 목록을 가져오는데 실패하였습니다',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
