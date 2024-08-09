import { Module, forwardRef } from '@nestjs/common';

import { PollService } from './poll.service';
import { PollController } from './poll.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [PollController],
  providers: [PollService], // AccessTokenGuard 추가
})
export class PollModule {}
