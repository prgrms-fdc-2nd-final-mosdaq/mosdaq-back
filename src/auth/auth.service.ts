import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getTokens(user: UsersModel) {
    const accessToken = this.assignJwtToken(user, false);
    const refreshToken = this.assignJwtToken(user, true);
    await this.usersService.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  assignJwtToken(
    user: Pick<UsersModel, 'email' | 'id'>,
    isRefreshToken: boolean,
  ) {
    const expiresIn = isRefreshToken
      ? this.configService.get<string>('REFRESH_TOKEN_EXPIRATION')
      : this.configService.get<string>('ACCESS_TOKEN_EXPIRATION');

    return this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
        type: isRefreshToken ? 'refreshToken' : 'accessToken',
      },
      { expiresIn: expiresIn },
    );
  }
}
