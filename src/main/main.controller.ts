import { Controller, Get, Inject, Query, Req } from '@nestjs/common';
import { MainService } from './main.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';

@Controller('api/v1/main-movie')
@ApiTags('대표 영화 api')
export class MainController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    private readonly mainService: MainService,
  ) {}

  private printWinstonLog(dto) {
    this.logger.error('error: ', dto);
    this.logger.warn('warn: ', dto);
    // this.logger.info('info: ', dto);
    // this.logger.http('http: ', dto);
    this.logger.verbose('verbose: ', dto);
    this.logger.debug('debug: ', dto);
    // this.logger.silly('silly: ', dto);
  }

  @Get('/')
  @ApiOperation({
    summary: '대표 영화 제공 API',
    description:
      '대표 영화 5개의 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터 요청',
  })
  @ApiResponse({
    status: 200,
    description:
      '서비스 운영자가 선정한 영화 5개의 영화 데이터 및 개봉 4주 전, 4주 후 주가 데이터와 함께 반환합니다.',
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
              countryCode: { type: 'string' },
              beforePrice: { type: 'number' },
              afterPrice: { type: 'number' },
              beforePriceDate: { type: 'string', format: 'date-time' },
              afterPriceDate: { type: 'string', format: 'date-time' },
            },
          },
        },
        movieListCount: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
  })
  async mainMovie() {
    // TOOD: 에러 핸들링
    // this.printWinstonLog();
    this.logger.log('main-movie');
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
    type: 'string',
    description: '투표 활성화 여부 (true)',
  })
  @ApiResponse({
    status: 200,
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
  @ApiResponse({
    status: 500,
    description: '서버 내부 오류로 인해 영화 목록을 가져올 수 없습니다.',
  })
  // TODO: @Req() req: any => @Req() req: Request  req.user 데이터 타입을 모르는 이슈 발생
  async popularPollingMovies(@Query('poll') poll: string, @Req() req: any) {
    try {
      const userId = req.user ? req.user.id : null;
      if (poll === 'true') {
        return await this.mainService.getPopularMoviesPolling(userId);
      } else if (poll === 'false') {
        return await this.mainService.getPopularMoviesPolled();
      } else {
        throw new Error('Invalid poll query parameter');
      }
    } catch (err) {
      console.error('Error in popularPollingMovies:', err);
      throw err;
    }
  }
}
