import { Test, TestingModule } from '@nestjs/testing';
import { MovieDetailService } from './movie-detail.service';

describe('MovieDetailService', () => {
  let service: MovieDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieDetailService],
    }).compile();

    service = module.get<MovieDetailService>(MovieDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
