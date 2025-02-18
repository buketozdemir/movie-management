import { Module } from '@nestjs/common';
import { Crypt } from '../../common/utils/crypt';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AuthLogic from './auth.logic';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_OPTIONS.JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  providers: [Crypt, AuthService, AuthLogic],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
