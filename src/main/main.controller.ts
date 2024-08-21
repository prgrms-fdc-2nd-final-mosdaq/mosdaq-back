import {
  Controller,
  DefaultValuePipe,
  Get,
  ParseBoolPipe,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MainService } from './main.service';
import { JwtAuthGuard } from 'src/auth/jwt/JwtAuth.guard';
import { JwtUserDto } from 'src/users/dto/JwtUser.dto';
import { User } from 'src/users/users.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { SWAGGER_INTERNAL_SERVER_ERROR_CONTENT } from 'src/constants';
import { MainMovieResponseDto } from './dto/main-movie-response.dto';
import { PopularMoviesPolledResponseDto } from './dto/popular-movie-polled-response.dto';
import {
  PopularMoviePollingDto,
  PopularMoviesPollingResponseDto,
} from './dto/popular-movie-polling-response.dto';

@Controller('api/v1/main-movie')
@ApiTags('대표 영화 api')
export class MainController {
  constructor(private readonly mainService: MainService) {}

  @Get('/')
  @ApiOperation({
    summary: '대표 영화 제공 API',
    description:
      '대표 영화 5개의 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터 요청',
  })
  @ApiOkResponse({
    description:
      '서비스 운영자가 선정한 영화 5개의 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터와 함께 반환합니다.',
    type: MainMovieResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
    content: SWAGGER_INTERNAL_SERVER_ERROR_CONTENT,
  })
  async mainMovie(): Promise<MainMovieResponseDto> {
    // TOOD: 에러 핸들링, service에서 해놓았으니 controller에서 예외처리를 하지 않아도 괜찮은가?
    return await this.mainService.getMainMovies();
  }

  @Get('/poll')
  @ApiOperation({
    summary: '투표 중인 영화 목록 API',
    description:
      '투표 중인 영화들 중에서 투표 횟수가 많은 순서로 5개의 영화를 반환합니다.',
  })
  @ApiQuery({
    name: 'poll',
    required: true,
    description: '투표 활성화 여부 (true)',
  })
  // TODO: responseDTO 를 swagger type으로 적용
  @ApiOkResponse({
    description: '성공적으로 투표 중인 영화 목록을 반환했습니다.',
    schema: {
      type: 'object',
      properties: {
        movieList: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              movieId: { type: 'number' },
              movieTitle: { type: 'string' },
              posterUrl: { type: 'string' },
              up: { type: 'number' },
              down: { type: 'number' },
              pollCount: { type: 'number' },
              myPollResult: { type: 'string', nullable: true },
            },
          },
        },
        movieListCount: { type: 'number' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
    content: SWAGGER_INTERNAL_SERVER_ERROR_CONTENT,
  })
  @UseGuards(JwtAuthGuard)
  async popularMoviesPoll(
    @Query('poll', new DefaultValuePipe(true), ParseBoolPipe) poll: boolean,
    @User() user: JwtUserDto | null,
  ): Promise<PopularMoviesPolledResponseDto | PopularMoviesPollingResponseDto> {
    // TODO: response DTO
    try {
      const userId = user?.sub ? user.sub : null;
      console.log('userId in popularMoviesPoll() : ', userId);

      if (poll === true) {
        return await this.mainService.getPopularMoviesPolling(userId);
      } else if (poll === false) {
        return await this.mainService.getPopularMoviesPolled();
      } else {
        throw new Error('Invalid poll query parameter');
      }
    } catch (err) {
      console.error('Error in popularMoviesPoll:', err);
      throw err;
    }
  }
}
