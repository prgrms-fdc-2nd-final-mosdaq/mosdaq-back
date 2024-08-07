import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GoogleOAuthDto {
  @ApiProperty({
    description: 'google oauth response code',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
