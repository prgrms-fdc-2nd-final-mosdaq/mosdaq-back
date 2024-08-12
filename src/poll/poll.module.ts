import { Module, forwardRef } from '@nestjs/common';

import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { Movie } from './entities/movie.entity';
import { UsersModel } from 'src/users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Poll, UsersModel, Movie]),
    forwardRef(() => AuthModule),
  ],
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}
