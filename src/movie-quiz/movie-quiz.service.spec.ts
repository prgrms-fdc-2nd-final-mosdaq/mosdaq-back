import { Test, TestingModule } from '@nestjs/testing';
import { MovieQuizService } from './movie-quiz.service';

describe('MovieQuizService', () => {
  let service: MovieQuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieQuizService],
    }).compile();

    service = module.get<MovieQuizService>(MovieQuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
