import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AccessTokenGuard } from './jwt/access-token.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          issuer: configService.get<string>('JWT_ISSUER'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  exports: [AccessTokenGuard, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, AccessTokenGuard, JwtAuthGuard],
})
export class AuthModule {}
