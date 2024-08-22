import { Module } from '@nestjs/common';
import { MovieListService } from './movie-list.service';
import { MovieListController } from './movie-list.controller';
import { Movie } from '../poll/entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie]), AuthModule, UsersModule],
  controllers: [MovieListController],
  providers: [MovieListService],
})
export class MovieListModule {}
