import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CompanyDto {
  companyCd: string;

  companyName: string;

  tickerName: string;

  country: string;
}
