import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Controller, Get, Put, Body, Param, Headers } from '@nestjs/common';
import { PollService } from './poll.service';
import { Repository } from 'typeorm';
import { Poll } from './entities/poll.entity';
import { UsersModel } from '../users/entities/users.entity';

@Controller('api/v1/poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Put(':movieId')
  create(
    @Param('movieId') movieId: number,
    @Headers('user-id') userId: number,
    @Body('pollResult') pollResult: 'up' | 'down',
  ) {
    return this.pollService.poll(movieId, userId, pollResult);
  }

  @Get()
  findAll() {
    return this.pollService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollService.findOne(+id);
  }
}
