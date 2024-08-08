import { Injectable } from '@nestjs/common';

@Injectable()
export class PollService {
  poll(movieId: number, userId: number, pollResult: 'up' | 'down') {}

  findAll() {
    return `This action returns all poll`;
  }

  findOne(id: number) {
    return `This action returns a #${id} poll`;
  }
}
