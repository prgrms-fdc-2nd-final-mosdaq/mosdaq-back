import { Module } from '@nestjs/common';
import { MovieQuizService } from './movie-quiz.service';
import { MovieQuizController } from './movie-quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieQuiz } from './entities/movie-quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovieQuiz])],
  controllers: [MovieQuizController],
  providers: [MovieQuizService],
})
export class MovieQuizModule {}
