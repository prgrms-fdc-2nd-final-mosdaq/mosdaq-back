import { Controller, Get, Param, Query } from '@nestjs/common';
import { MovieQuizService } from './movie-quiz.service';
import { GetMovieQuizDto } from './dto/get-movie-quiz.dto';
import {
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { MovieQuizDto } from './dto/movie-quiz.dto';

@Controller('api/v1/')
@ApiTags('영화 퀴즈 api')
export class MovieQuizController {
  constructor(private readonly movieQuizService: MovieQuizService) {}

  @Get('movie/quiz')
  @ApiOperation({
    summary: '영화 퀴즈 목록 제공 API',
    description: '랜덤한 영화 퀴즈 데이터 제공 (default count 값 = 10)',
  })
  @ApiOkResponse({
    description: '영화 제목, 4주전, 4주후의 주가 데이터를 제공합니다',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          movieTitle: { type: 'string' },
          moviePoster: { type: 'string' },
          fourWeeksBeforePrice: { type: 'number' },
          fourWeeksAfterPrice: { type: 'number' },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
  })
  getMovieQuiz(@Query() dto: GetMovieQuizDto): Promise<MovieQuizDto[]> {
    return this.movieQuizService.getRandomMovieQuiz(dto);
  }
}
