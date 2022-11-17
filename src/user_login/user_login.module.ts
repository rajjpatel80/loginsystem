import { MiddlewareConsumer } from '@nestjs/common';

import { UserLoginController } from './user_login.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLoginService } from './user_login.service';
import { UserSQL } from '../sql/UserSQL';
import { PassportSQL } from '../sql/PassportSQL';
import { BcryptServices } from '../shared/BcryptServices';
import { ErrorServices } from '../shared/ErrorServices';
import { PassportServices } from '../shared/PassportServices';
import { UtilService } from '../shared/UtilService';
import { FireMessageServices } from '../shared/firemessageservice';
import { Module, Controller, NestModule } from '@nestjs/common';
import { SQLService } from '../shared/SQLServices';
@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [
    UserLoginController,
    UserLoginService,
    BcryptServices,
    ErrorServices,
    PassportServices,
    UtilService,
    UserSQL,
    PassportSQL,
    SQLService,
    FireMessageServices,
  ],
  controllers: [UserLoginController],
  exports: [UserLoginService],
})
export class UserLoginModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {}
}
