import { Injectable } from '@nestjs/common';
import { DoPollDto } from './dto/do-poll.dto';

@Injectable()
export class PollService {
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
  poll(movieId: number, userId: number, pollResult: 'up' | 'down') {
    // TODO: 실제 데이터로 수정
    return {
      point: 0,
      rank: 42,
    };
  }

  findAll() {
    return `This action returns all poll`;
  }

  findOne(id: number) {
    return `This action returns a #${id} poll`;
  }
}
