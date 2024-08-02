import { Injectable } from '@nestjs/common';

@Injectable()
export class MainService {
  constructor() {}

  getMainMovie(): any {
    const movieInfo = {
      movieId: 60,
      movieTitle: '어벤져스: 엔드게임',
      posterUrl: 'http://file.koreafilm.or.kr/thm/02/00/05/14/tn_DPF018019.jpg',
      countryCode: 'US',
      beforePrice: 110.28,
      afterPrice: 133.85,
      beforePriceDate: '2019-03-27',
      afterPriceDate: '2019-05-22',
    };
    const movieList = [movieInfo];

    return {
      movieList,
      movieListCount: movieList.length,
    };
  }
}
