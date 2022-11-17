import { PayloadDto } from './dto/user-login.dto';
import { SQLService } from '../shared/SQLServices';
import { PassportServices } from '../shared/PassportServices';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { validate } from 'class-validator';
import { PassportSQL } from '../sql/PassportSQL';
import { UserSQL } from '../sql/UserSQL';
import { passportEntity } from '../user/user.entity';
import { plainToClass } from 'class-transformer';
import { Injectable, HttpStatus } from '@nestjs/common';
import { BcryptServices } from '../shared/BcryptServices';
import { UtilService } from '../shared/UtilService';
import { ErrorServices } from '../shared/ErrorServices';
import { FireMessageServices } from '../shared/firemessageservice';

import _ = require('lodash');
import { UserLoginDto } from './dto/index';
import { TableInheritance } from 'typeorm';

@Injectable()
export class UserLoginService {
  constructor(
    private readonly sql: SQLService,
    private readonly userQuery: UserSQL,
    private readonly passportServices: PassportServices,
    private readonly passportSQL: PassportSQL,
    private readonly utilService: UtilService,
    private readonly errorServices: ErrorServices,
    private readonly bcryptServices: BcryptServices,
    private fireMessageServices: FireMessageServices,
  ) {}

  async firemessagesendservice(payLoadDto: PayloadDto): Promise<any> {
    return this.fireMessageServices.sendNotification(payLoadDto);
  }

  async userLogin(userLoginDto: UserLoginDto): Promise<any> {
    const loginData = plainToClass(UserLoginDto, userLoginDto);

    //validate userlogin dto
    const errorList = await validate(loginData);
    if (errorList.length > 0) {
      const errors = this.errorServices.validationErrorResponse(errorList);
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      let userDatabyemail = await this.sql.run(
        this.userQuery.findByEmail(),
        userLoginDto,
      );
      if (userDatabyemail && userDatabyemail.length === 0) {
        const emailError = { eMail: 'Invalid Email.' };
        throw new HttpException(
          {
            message: 'Invalid Email or Password',
            emailError,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      userDatabyemail = _.first(userDatabyemail);
      const idUser = userDatabyemail.idUser;
      const eMail = userDatabyemail.eMail;
      const fName = userDatabyemail.fName;

      let userPassportData = await this.sql.run(
        this.passportSQL.getPassportDetailByUserId(),
        { idUser: idUser },
      );
      userPassportData = _.first(userPassportData);

      const isValidPassword = await this.bcryptServices.decryptPassword(
        loginData.password,
        userPassportData.password,
      );

      if (isValidPassword === false) {
        const passwordError = { password: 'Invalid Password' };
        throw new HttpException(
          { message: 'Invalid Email or Password.', passwordError },
          HttpStatus.BAD_REQUEST,
        );
      }

      const createTokenData = {
        idUser: idUser,
        fName: fName,
        eMail: loginData.eMail,
      };
      const newToken = this.passportServices.createToken(
        createTokenData,
        null,
        null,
      );
      const fireToken = loginData.fireToken;

      const newRefreshToken = this.passportServices.generateRefreshToken();

      const updateTokenQuerydata = {
        idUser: userPassportData.idUser,
        accessToken: newToken,
        refreshtoken: newRefreshToken,
        fireToken: fireToken,
      };
      await this.sql.run(
        this.passportSQL.updateTokenWhenLogin(),
        updateTokenQuerydata,
      );

      const responseData = {
        success: 'T',
        data: {
          idUser: userPassportData.idUser,
          accessToken: newToken,
          refreshToken: newRefreshToken,
          fName: userDatabyemail.fName,
        },
      };
      return responseData;
    }
  }
}
