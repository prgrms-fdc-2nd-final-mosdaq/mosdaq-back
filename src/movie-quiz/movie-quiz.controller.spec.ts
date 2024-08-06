import { Test, TestingModule } from '@nestjs/testing';
import { MovieQuizController } from './movie-quiz.controller';
import { MovieQuizService } from './movie-quiz.service';

describe('MovieQuizController', () => {
  let controller: MovieQuizController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieQuizController],
      providers: [MovieQuizService],
    }).compile();

    controller = module.get<MovieQuizController>(MovieQuizController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
