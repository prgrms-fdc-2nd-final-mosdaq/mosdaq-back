import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RefreshAuthTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
