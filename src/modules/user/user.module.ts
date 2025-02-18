import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserDataAccess } from './data-accesses/user.data-access';
import { User, UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRoleService } from './services/user-role.service';
import { UserRoleDataAccess } from './data-accesses/user-role.data-access';
import { UserRoleController } from './controllers/user-role.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController, UserRoleController],
  providers: [UserService, UserRoleService, UserDataAccess, UserRoleDataAccess],
  exports: [UserService, UserRoleService],
})
export class UserModule {}
