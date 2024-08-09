import {
  // BadRequestException,
  UseGuards,
} from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import { Controller, Put, Body, Param, Headers } from '@nestjs/common';
import { PollService } from './poll.service';
import {
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { DoPollDto } from './dto/do-poll.dto';
// import { Repository } from 'typeorm';
// import { Poll } from './entities/poll.entity';

@ApiTags('투표 관련')
@Controller('api/v1/poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Put(':movieId')
  @ApiOperation({
    summary: '투표하기 API',
    description: '영화가 개봉 4주 이후에 오를지, 내릴지에 대해 투표합니다.',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer 토큰을 포함한 인증 헤더입니다.',
    required: true,
    example: 'Bearer your_token_here',
  })
  @ApiOkResponse({
    description: '유저 정보',
    type: DoPollDto,
  })
  @ApiUnauthorizedResponse({
    description:
      '유효하지 않은 토큰입니다. 다시 로그인 하십시오 | 인증 토큰이 없습니다.',
  })
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
  @UseGuards(AccessTokenGuard)
  async poll(
    @Param('movieId') movieId: number,
    @Headers('user-id') userId: number,
    @Body('pollResult') pollResult: 'up' | 'down',
  ): Promise<DoPollDto> {
    return this.pollService.poll(movieId, userId, pollResult);
  }
}
