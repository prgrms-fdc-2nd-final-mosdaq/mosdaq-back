import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { Poll } from './entities/poll.entity';
import { UsersModel } from '../users/entities/users.entity'; // UsersModel 사용
import { DoPollDto, DoPollResponseDto } from './dto/do-poll.dto';
import { POLL_PARTICIPATION_POINTS } from 'src/constants';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,

    @InjectRepository(UsersModel)
    private readonly userRepository: Repository<UsersModel>,
  ) {}

  /**
   * @param movieId
   * @param userId
   * @param pollResult
   *
   * 0. 2-2의 과정을 transaction으로 묶는다.
   * 1. poll 테이블에 이미 같은 유저 & 영화로 검색했을 때,
   *    레코드가 있는지 확인한다
   * 2-1. 있다면 poll테이블에 값을 업데이트 한다
   * 2-2. 없다면
   *      poll테이블과 값을 insert into 한다
   *      user테이블의 point를 update 한다.
   * 3.user테이블에서 point와 rank 정보를 가져온다.
   */
  // TODO: Transaction 처리 필요!!!, 어느 범위까지 묶을 것인가?
  async poll(doPollDto: DoPollDto): Promise<DoPollResponseDto> {
    const { movieId, userId, pollResult } = doPollDto;
    console.log('movieId : ', movieId);
    console.log('userId : ', userId);
    console.log('pollResult : ', pollResult);
    // 1. poll 테이블에 이미 같은 유저 & 영화로 검색했을 때, 레코드가 있는지 확인한다
    try {
      let poll = await this.pollRepository.findOne({
        where: { userId: userId, movieId: movieId },
      });

      console.log('poll : ', poll);
      if (poll) {
        // 2-1. 있다면 poll 테이블에 값을 업데이트 한다
        poll.pollFlag = pollResult === 'up';
        await this.pollRepository.save(poll);
      } else {
        // TODO: 2-2. 실제 존재하는 영화인지 확인한다.
        // movie 테이블에 검색
        // 2-3. 없다면 poll 테이블에 값을 insert 한다
        poll = this.pollRepository.create({
          userId: userId,
          movieId: movieId,
          pollFlag: pollResult === 'up',
        });
        await this.pollRepository.save(poll);

        // user 테이블의 point를 업데이트 한다
        await this.userRepository.increment(
          { id: userId },
          'point',
          POLL_PARTICIPATION_POINTS,
        ); // UsersModel의 필드명을 사용
      }

      // 3. user 테이블에서 point와 rank 정보를 가져온다
      const user = await this.userRepository.findOne({ where: { id: userId } });

      // rank 계산 (예시: 사용자 포인트 순위)
      const totalUsers = await this.userRepository.count();
      const higherPointUsers = await this.userRepository.count({
        where: { point: MoreThan(user.point) },
      });

      const percentile = Math.floor(
        ((higherPointUsers + 1) / totalUsers) * 100,
      );

      return {
        point: user.point,
        rank: percentile, // 해당 유저 포함 순위
      };
    } catch (err) {
      // TODO:
      console.log('서버 에러');
      throw new InternalServerErrorException();
    }
  }
}
