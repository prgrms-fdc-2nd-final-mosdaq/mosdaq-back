import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { Movie } from 'src/poll/entities/movie.entity';
import { Stock } from 'src/stocks/entities/stock.entity';
import { Company } from 'src/stocks/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersModel, Movie, Stock, Company]),
    forwardRef(() => AuthModule),
    ConfigModule,
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
