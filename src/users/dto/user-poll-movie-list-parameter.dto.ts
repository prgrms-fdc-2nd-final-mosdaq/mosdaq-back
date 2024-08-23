import { IsEnum, IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SortEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class UserPollMovieParamDto {
  @ApiProperty({
    description: '투표 중인 영화(true), 투표 마감된 영화(false)',
    example: true,
  })
  @IsBoolean()
  poll: boolean;

  @ApiProperty({
    description: '올해 연도',
    example: '2024',
  })
  @IsInt()
  year: number;

  @ApiProperty({
    description:
      '검색 시작하는 위치, 검색결과 기준 n번째를 의미(n은 0 이상 양의 정수)',
    example: 0,
  })
  @IsInt()
  offset: number;

  @ApiProperty({
    description: '한 페이지에 보이는 영화 개수',
    example: 30,
  })
  @IsInt()
  limit: number;

  @ApiProperty({
    description: '목록 정렬 조건, 개봉일 기준 최신, 오래된 순',
    enum: SortEnum,
    example: SortEnum.DESC || SortEnum.ASC,
  })
  @IsEnum(SortEnum)
  sort: SortEnum;

  @ApiProperty({
    description: 'user id 번호',
    example: 42,
  })
  @IsInt()
  userId: number;
}
