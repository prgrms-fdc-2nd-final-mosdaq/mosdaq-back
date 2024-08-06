import { Controller, Get } from '@nestjs/common';
import { MovieQuizService } from './movie-quiz.service';
import { MovieQuiz } from './entities/movie-quiz.entity';

@Controller('api/v1/')
export class MovieQuizController {
  constructor(private readonly movieQuizService: MovieQuizService) {}

  @Get('movie/quiz')
  async getMovieQuiz(): Promise<MovieQuiz[]> {
    return this.movieQuizService.getRandomMovieQuiz(10);
  }
}
