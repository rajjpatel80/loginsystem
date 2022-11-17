import { UserData } from './../../user/user.interface';
import { User } from './../../user/user.Decorator';
import { PassportServices } from './../PassportServices';
import { JWT_SECRET_KEY } from './../../config';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import _ = require('lodash');
import { UtilService } from './../UtilService';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly passportService: PassportServices,
    private readonly utilservice: UtilService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authheaders = req.headers.authorization;
    if (authheaders && (authheaders as string).split(' ')[1]) {
      const token = (authheaders as string).split(' ')[1];
      const refreshtoken = req.headers['refresh-token'];

      console.log('Token=>' + token);
      console.log('RefreshToken=>' + refreshtoken);
      // const _eMail = jwt.verify(token, JWT_SECRET_KEY);
      // console.log('email data from headers==>' + _eMail);
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
        console.log('decoded=>' + decoded.user.idUser);

        const isUserValid: any = await this.verifyUserById(
          decoded.user.idUser,
          token,
        );
        console.log('Isuservalid==>' + isUserValid.status);
        if (isUserValid.status) {
          isUserValid.data.eMail = decoded.user.eMail;
          //req.user  = isUserValid.data;
          next();
        } else {
          // return this.passportService.updatepassportwithnewtoken(
          //   token,
          //   refreshtoken.toString(),
          // );
          throw new HttpException(
            {
              errorType: 'INACTIVE_USER',
              message: 'Inactive User',
              errorcode: 401,
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
      } catch (err) {
        console.log(err.name);
        if (err.name == 'TokenExpiredError' && refreshtoken) {
          // const resdata = await this.passportService.updatepassportwithnewtoken(
          //   token,
          //   refreshtoken.toString(),
          // );
          // console.log(
          //   'update passport data==>' + resdata['data']['refreshToken'],
          // );
          // if (resdata) {
          //   next();
          //   return resdata;
          // } else {
          throw new HttpException(
            {
              errorType: 'TOKEN_EXPIRE',
              message: 'Token Expire',
              errorcode: 401,
            },
            HttpStatus.UNAUTHORIZED,
          );
          //}
        }
        throw new HttpException(
          {
            errorType: 'TOKEN_INVAID',
            message: 'Invalid Token',
            errorcode: 401,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }
  }

  async verifyUserById(id, token): Promise<any> {
    const user = await this.passportService.verifyUserWithIdAndToken(id, token);
    const _user: any = _.first(user);
    console.log('Verifyuser=>' + _user);
    if (!_user || user.length == 0) {
      return { status: false };
    } else if (!_user.status) {
      return { stauts: false };
    } else {
      return {
        status: true,
        data: {
          idUser: _user.idUser,
        },
      };
    }
  }
}
