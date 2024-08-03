import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UsersModel } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID, // 클라이언트 ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // 시크릿
      callbackURL: 'http://localhost:3000/auth/google', // 콜백 URL
      scope: ['email', 'profile'], // scope
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, name, emails } = profile;

    const providerId = id;
    const email = emails[0].value;

    const user: UsersModel = await this.userService.findUserByEmailOrSave(
      email,
      name.familyName + name.givenName,
      providerId,
    );

    return user;
  }
}
