import { ApiProperty } from '@nestjs/swagger';

export class StockInfoResponseByMovieId {
  @ApiProperty({
    description: '개봉 4주 전 날짜(YYYY-MM-DD)',
    type: Date,
  })
  beforePriceDate: Date;

  @ApiProperty({
    description: '개봉 4주 전 주가',
    type: Number,
  })
  beforePrice: number;

  @ApiProperty({
    description: '개봉 4주 후 날짜(YYYY-MM-DD)',
    type: Date,
  })
  afterPriceDate: Date;

  @ApiProperty({
    description: '개봉 4주 후 주가',
    type: Number,
  })
  afterPrice: number;

  @ApiProperty({
    description: '관련 업계 평균 주가 변화율',
    type: Number,
  })
  stockIndustryAverageVariation: number;

  @ApiProperty({
    description: '회사 이름',
    type: String,
  })
  companyName: string;

  @ApiProperty({
    description: '회사 상장 국가 코드',
    type: String,
  })
  countryCode: string;
}
