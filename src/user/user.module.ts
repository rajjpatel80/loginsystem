import { userMasterEntity, passportEntity } from './user.entity';
import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
} from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './User.Service';
import { SQLService } from '../shared/SQLServices';
import { UserSQL } from '../sql/UserSQL';
import { PassportServices } from '../shared/PassportServices';
import { PassportSQL } from '../sql/PassportSQL';
import { UtilService } from '../shared/UtilService';
import { BcryptServices } from '../shared/BcryptServices';
import { ErrorServices } from '../shared/ErrorServices';
import { EmailService } from '../shared/EmailService';
import { AuthMiddleware } from '../shared/middleware/AuthMiddleware';
//import { FireMessageServices } from '../shared/firemessageservice';
import { request } from 'http';

@Module({
  imports: [TypeOrmModule.forFeature([userMasterEntity, passportEntity])],
  providers: [
    UserService,
    SQLService,
    UserSQL,
    PassportServices,
    PassportSQL,
    UtilService,
    BcryptServices,
    ErrorServices,
    EmailService,
    //FireMessageServices,
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'getAllUsers', method: RequestMethod.GET },
        { path: 'updateUser', method: RequestMethod.PUT },
        { path: 'getUserProfile', method: RequestMethod.GET },
        { path: 'findUserById', method: RequestMethod.GET },
      );
  }
}
