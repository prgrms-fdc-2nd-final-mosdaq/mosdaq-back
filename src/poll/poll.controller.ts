import { BadRequestException, Get, Request, UseGuards } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
import { Controller, Put, Body, Param } from '@nestjs/common';
import { PollService } from './poll.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/Jwt/accessToken.guard';
import { DoPollDto, DoPollResponseDto } from './dto/do-poll.dto';
import { PollBoxDto, PollBoxResponseDto } from './dto/poll-box.dto';
import { OptionalAccessTokenGuard } from 'src/auth/optionalAccessToken.guard';
import { UsersModel } from 'src/users/entities/users.entity';
import { User } from 'src/users/users.decorator';
import { JwtStrategy } from 'src/auth/Jwt/Jwt.strategy';
import { JwtAuthGuard } from 'src/auth/Jwt/JwtAuth.guard';
// import { Repository } from 'typeorm';
// import { Poll } from './entities/poll.entity';

@ApiTags('투표 관련')
@Controller('api/v1/poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @ApiBearerAuth('access-token')
  @Put(':movieId')
  @ApiOperation({
    summary: '투표하기 API',
    description: '영화가 개봉 4주 이후에 오를지, 내릴지에 대해 투표합니다.',
  })
  @ApiBody({
    description: '어디에 투표했는지 "up" | "down" 문자열 값으로 요청합니다',
    schema: {
      properties: {
        pollResult: { type: 'string' },
      },
    },
  })
  @ApiOkResponse({
    description: '유저 정보',
    type: DoPollResponseDto,
  })
  @ApiUnauthorizedResponse({
    description:
      '유효하지 않은 토큰입니다. 다시 로그인 하십시오 | 인증 토큰이 없습니다.',
  })
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
  @UseGuards(AccessTokenGuard)
  // TODO: ValidationPipe 별도 로직으로 분리
  async poll(
    @Param('movieId') movieId: number,
    // @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    // doPollDto: DoPollDto,
    @Body('pollResult') pollResult: 'up' | 'down',
    @Request() req,
  ): Promise<DoPollResponseDto> {
    const userId: number = req.user.sub;
    const doPollDto: DoPollDto = { movieId, userId, pollResult };

    if (!doPollDto.pollResult) {
      throw new BadRequestException(
        'pollResult는 "up" 또는 "down"이어야 합니다.',
      );
    }

    doPollDto.userId = userId;
    doPollDto.movieId = movieId;

    console.log('doPollDto : ', doPollDto);
    return this.pollService.poll(doPollDto);
  }

  //투표함 api
  @ApiBearerAuth('access-token')
  @Get(':movieId')
  @ApiOperation({
    summary: '투표함 가져오는 api',
    description: '영화에 대한 투표함 데이터를 가져옵니다',
  })
  @ApiOkResponse({
    description: '투표함 정보',
    type: PollBoxResponseDto,
  })
  @ApiUnauthorizedResponse({
    description:
      '유효하지 않은 토큰입니다. 다시 로그인 하십시오 | 인증 토큰이 없습니다.',
  })
  @ApiNotFoundResponse({
    description: '요청하신 정보를 찾을 수 없습니다.',
  })
  @UseGuards(JwtAuthGuard)
  async getPollBox(
    @Param('movieId') movieId: number,
    @User() user: UsersModel,
  ): Promise<PollBoxResponseDto> {
    return this.pollService.getPollBoxByMovieId(movieId);
  }
}
