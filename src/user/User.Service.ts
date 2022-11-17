import { userMasterEntity, passportEntity } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

import { plainToClass } from 'class-transformer';
import { UtilService } from './../shared/UtilService';
import { PassportServices } from './../shared/PassportServices';
import { Injectable, Inject, Scope, HttpStatus } from '@nestjs/common';
import { CreateUserDto, CreatePassportDto } from './dto';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { SQLService } from './../shared/SQLServices';
import { UserSQL } from './../sql/UserSQL';
import { validate } from 'class-validator';
import { PassportSQL } from './../sql/PassportSQL';
import { BcryptServices } from './../shared/BcryptServices';
import { EmailService } from './../shared/EmailService';
import { ErrorServices } from './../shared//ErrorServices';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
  constructor(
    @InjectRepository(userMasterEntity)
    private readonly userRepository: Repository<userMasterEntity>,

    @InjectRepository(passportEntity)
    private readonly passportRepository: Repository<passportEntity>,

    private readonly sql: SQLService,
    private readonly userQuery: UserSQL,
    private readonly passportServices: PassportServices,
    private readonly passportSQl: PassportSQL,
    private readonly utilService: UtilService,
    private readonly bcryptServices: BcryptServices,
    private readonly emailService: EmailService,
    private readonly errorService: ErrorServices,

    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async Create(userDto: CreateUserDto): Promise<any> {
    console.log('Chemerp: Create Event started');
    console.log(userDto);
    const users = plainToClass(CreateUserDto, userDto);
    const passportObj = new CreatePassportDto();

    const eMail = userDto.eMail;

    //validate user model
    const errorlists = await validate(users);
    //console.log(users);
    if (errorlists.length > 0) {
      const errors = this.errorService.validationErrorResponse(errorlists);
      throw new HttpException(
        { message: 'Input data validation failed', errors },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const result = await this.sql.run(this.userQuery.findByEmail(), userDto);

      if (result && result.length > 0) {
        const errors = { username: 'Email must be unique' };
        throw new HttpException(
          { message: 'Input data validation failed', status: false, errors },
          HttpStatus.BAD_REQUEST,
        );
      }

      userDto.status = 'T';
      const password = await this.bcryptServices.encryptPassword(
        userDto.password,
      );
      userDto.createDate = this.utilService.getDateFormat();
      userDto.updateDate = this.utilService.getDateFormat();
      userDto.password = password;

      //console.log("UserDto==>" + userDto.fName);

      const saveduser = await this.sql.run(this.userQuery.addUser(), userDto);
      console.log(saveduser);

      if (saveduser && saveduser.insertId > 0) {
        const accessToken = this.passportServices.createToken(
          {
            idUser: saveduser.insertId,
            fName: userDto.fName,
            eMail: userDto.eMail,
          },
          '',
          '',
        );
        const refreshToken = this.passportServices.generateRefreshToken();

        console.log('Rajen==>' + eMail);

        passportObj.idUser = saveduser.insertId;
        passportObj.eMail = eMail;
        passportObj.accessToken = accessToken;
        passportObj.refreshToken = refreshToken;
        passportObj.password = password + '';
        passportObj.protocol = 'passport-jwt';
        passportObj.protocol = this.utilService.getDateFormat();
        passportObj.updateDate = this.utilService.getDateFormat();

        const savedPassport = await this.sql.run(
          this.passportSQl.addPassport(),
          passportObj,
        );


        if (savedPassport && savedPassport.InsertId > 0) {
          console.log(passportObj.accessToken);
          console.log('Data Saved');

          return {
            success: 'T',
            accessToken: passportObj.accessToken,
            refreshToken: passportObj.refreshToken,
          };
        }
      }
      const returndata = {
        success: 'T',
        data: {
          accessToken: passportObj.accessToken,
          refreshToken: passportObj.refreshToken,
        },
      };
      console.log(returndata);
      return returndata;
    }
  }

  async findUserById(id: number): Promise<any> {
    const userData = {
      idUser: id,
    };

    const user = await this.sql.run(this.userQuery.findByUserId(), userData);
    if (!user) {
      const error = { user: 'not found' };
      throw new HttpException({ error }, 401);
    } else {
      return {
        success: 'T',
        data: user,
      };
    }
  }

  // async finduserDataforMsg(id: number): Promise<any> {
  //   const userData = {
  //     idUser: id,
  //   };
  //   const user = await this.sql.run(
  //     this.userQuery.findUserDataforMsgq(),
  //     userData,
  //   );
  //   if (!user) {
  //     const error = { user: 'not found' };
  //     throw new HttpException({ error }, 401);
  //   } else {
  //     return user;
  //   }
  // }

  async getUserProfile(): Promise<any> {
    const userid = this.utilService.getUserIdFromToken(
      this.request.headers.authorization,
    );
    const userdata = {
      idUser: userid,
      type: 'profile',
    };

    const user = await this.sql.run(this.userQuery.findByUserId(), userdata);

    if (!user) {
      throw new HttpException(
        { message: 'User not found', status: false },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      const responseData = {
        success: 'T',
        data: user,
      };
      return responseData;
    }
  }

  async getAllUser(): Promise<any> {
    try {
      const result = await this.sql.run(this.userQuery.getAllUsers());
      const responseData = {
        success: 'T',
        data: result,
      };
      console.log(result);
      return responseData;
    } catch (error) {
      throw new HttpException(
        { message: 'Get all user details failed', status: false },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async getAllUserData(): Promise<any> {
    try {
      const result = await this.sql.run(this.userQuery.getAllUserdata());
      const responseData = {
        success: 'T',
        data: result,
      };
      return responseData;
    } catch (error) {
      throw new HttpException(
        { message: 'Get all user details failed', status: false },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUSer(updateUserDto: UpdateUserDto): Promise<any> {
    try {
      const users = plainToClass(UpdateUserDto, updateUserDto);
      //const userid = this.utilService.getUserIdFromToken(this.request.headers.authorization);
      // const selectedUSer = this.sql.run(this.userQuery.findByUserId(), userid);
      const selectedUSer = await this.sql.run(
        this.userQuery.findByUserId(),
        users,
      );

      if (selectedUSer) {
        //users.idUser = userid;
        const errorlist = await validate(users);
        if (errorlist.length > 0) {
          const errors = this.errorService.validationErrorResponse(errorlist);
          throw new HttpException(
            { message: 'Input Data Validation Failed', errors },
            HttpStatus.BAD_REQUEST,
          );
        }

        try {
          // const companyRow = await this.sql.run(this.userQuery.findByCompanyName(), users);
          // if(companyRow.length == 0 )
          // {

          const updateUserData = await this.sql.run(
            this.userQuery.updateUser(),
            users,
          );
          if (updateUserData.affectedRows === 1) {
            const responseData = {
              success: 'T',
              data: users,
            };
            return responseData;
          } else {
            throw new HttpException(
              { message: 'User not found', status: false },
              HttpStatus.BAD_REQUEST,
            );
          }
          // }
          // else
          // {
          //     const responseData = {
          //         status: false,
          //         message: "User already exist",
          //     };
          //     return responseData;
          // }
        } catch (error) {
          if (error.code && error.code == 'ER_DUP_ENTRY') {
            throw new HttpException(
              {
                message: 'Profile update failed',
                status: false,
                data: updateUserDto,
              },
              HttpStatus.BAD_REQUEST,
            );
          }

          throw new HttpException(
            {
              message: 'Profile update failed',
              status: false,
              data: updateUserDto,
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        return {
          success: 'F',
          message: 'User not found',
        };
      }
    } catch (error) {
      throw new HttpException(
        { message: 'Profile update failed', status: false },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updatePassportRefreshToken(_token: string, _refreshtoken: string) {
    const resdata = await this.passportServices.updatepassportwithnewtoken(
      _token,
      _refreshtoken,
    );
    console.log('update passport data==>' + resdata['data']['refreshToken']);
    if (resdata) {
      return resdata;
    }
  }
}
