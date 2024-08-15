import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, MoreThan } from 'typeorm';
import { Poll } from './entities/poll.entity';
import { UsersModel } from '../users/entities/users.entity';
import { DoPollDto, DoPollResponseDto } from './dto/do-poll.dto';
import { POLL_PARTICIPATION_POINTS } from 'src/constants';
import { Movie } from './entities/movie.entity';
import { PollBoxDto, PollBoxResponseDto } from './dto/poll-box.dto';

// TODO: logger로 전환
@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,

    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async poll(doPollDto: DoPollDto): Promise<DoPollResponseDto> {
    const { movieId, userId, pollResult } = doPollDto;

    // 1. movieId가 movie 테이블에 있는지 확인
    const movie = await this.movieRepository.findOne({
      where: { movieId: movieId },
    });
    if (!movie) {
      console.warn(
        `유효하지 않은 영화 ID ${movieId}: 영화가 존재하지 않습니다.`,
      );
      throw new BadRequestException(
        '유효하지 않은 영화 ID: 영화가 존재하지 않습니다.',
      );
    }

    // 트랜잭션 시작
    try {
      return await this.pollRepository.manager.transaction(
        async (manager: EntityManager) => {
          console.log(
            `유저 ${userId}와 영화 ${movieId}에 대한 투표 트랜잭션 시작`,
          );

          // 2. poll 테이블에 이미 같은 유저 & 영화로 검색했을 때, 레코드가 있는지 확인
          let poll = await manager.findOne(Poll, {
            where: { userId: userId, movieId: movieId },
          });

          if (poll) {
            // 3. 있다면 poll 테이블에 값을 업데이트
            poll.pollFlag = pollResult === 'up';
            await manager.save(poll);
            console.log(
              `유저 ${userId}와 영화 ${movieId}에 대한 투표 업데이트`,
            );
          } else {
            // 4. 없다면 poll 테이블에 값을 insert
            // create()는 객체를 메모리에서 생성하는 동기적 작업이므로 await가 필요없다.
            poll = manager.create(Poll, {
              userId: userId,
              movieId: movieId,
              pollFlag: pollResult === 'up',
            });

            await manager.save(poll);
            console.log(
              `유저 ${userId}와 영화 ${movieId}에 대한 새로운 투표 생성`,
            );

            // 5. user 테이블의 point를 업데이트
            await manager.increment(
              UsersModel,
              { id: userId },
              'point',
              POLL_PARTICIPATION_POINTS,
            );
            console.log(
              `유저 ${userId}의 포인트 ${POLL_PARTICIPATION_POINTS} 증가`,
            );
          }

          // 6. user 테이블에서 point와 rank 정보를 가져옴
          const user = await manager.findOne(UsersModel, {
            where: { id: userId },
          });

          // rank 계산 (예시: 사용자 포인트 순위)
          const totalUsers = await manager.count(UsersModel);
          const higherPointUsers = await manager.count(UsersModel, {
            where: { point: MoreThan(user.point) },
          });

          const percentile = Math.floor(
            ((higherPointUsers + 1) / totalUsers) * 100,
          );
          console.log(`유저 ${userId}의 순위를 ${percentile} 백분위로 계산`);

          return {
            point: user.point,
            rank: percentile,
          };
        },
      );
    } catch (error) {
      console.error(
        `유저 ${userId}와 영화 ${movieId}에 대한 투표 트랜잭션 실패`,
        error.stack,
      );
      throw new InternalServerErrorException(
        '서버 오류로 인해 투표 처리가 실패했습니다.',
      );
    }
  }

  async getPollBoxByMovieId(
    pollBoxDto: PollBoxDto,
  ): Promise<PollBoxResponseDto> {
    const movie = await this.movieRepository.findOne({
      where: { movieId: pollBoxDto.id },
    });
    if (!movie) {
      console.warn(
        `유효하지 않은 영화 ID ${pollBoxDto.id}: 영화가 존재하지 않습니다.`,
      );
      throw new BadRequestException(
        '유효하지 않은 영화 ID: 영화가 존재하지 않습니다.',
      );
    }

    try {
      const { id, userId } = pollBoxDto;

      const totalUpCount = await this.pollRepository.count({
        where: {
          movieId: id,
          pollFlag: true,
        },
      });

      const totalDownCount = await this.pollRepository.count({
        where: {
          movieId: id,
          pollFlag: false,
        },
      });

      let pollResult: 'up' | 'down' | null = null;

      if (userId) {
        const isUserVoted = await this.pollRepository.findOne({
          where: { userId, movieId: id },
        });
        if (isUserVoted) {
          pollResult = isUserVoted.pollFlag ? 'up' : 'down';
        }
      }

      const response: PollBoxResponseDto = {
        total: totalUpCount + totalDownCount,
        up: totalUpCount,
        down: totalDownCount,
        ...(userId && { pollResult }), // userId가 있는 경우에만 pollResult 포함
      };

      return response;
    } catch (err) {
      console.error(`투표함을 가져오지 못했습니다.`, err.stack);
      throw new InternalServerErrorException(
        '서버 오류로 인해 투표함을 가져오지 못했습니다.',
      );
    }
  }
}
