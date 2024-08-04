import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(AccessTokenGuard)
  async getUserInfo(@Request() req) {
    const user = await this.userService.findUserById(req.user.id);

    return {
      name: user.name,
      email: user.email,
      point: user.point,
      rank: 10,
    };
  }
}
