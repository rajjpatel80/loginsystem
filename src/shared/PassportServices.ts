import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { PassportSQL } from './../sql/PassportSQL';
const jwt = require('jsonwebtoken');
import { PASSPORT_STRATEGY, JWT_SECRET_KEY } from '../config';
import { UtilService } from './UtilService';
import { Injectable, HttpStatus } from '@nestjs/common';
import { SQLService } from './SQLServices';

@Injectable()
export class PassportServices {
  constructor(
    private utilService: UtilService,
    private readonly sql: SQLService,
    private readonly passportSQL: PassportSQL,
  ) {}

  createToken(user, idDevice, Serial) {
    const config = PASSPORT_STRATEGY;
    return jwt.sign(
      {
        user: user.toJSON ? user.toJSON() : user,
        idDevice: idDevice,
        Serial: Serial,
      },
      config.tokenoptions.secret,
      {
        algorithm: config.tokenoptions.algorithm,
        expiresIn: config.tokenoptions.expiresInSeconds,
        issuer: config.tokenoptions.issuer,
        audience: config.tokenoptions.audience,
      },
    );
  }

  generateRefreshToken() {
    var Util = new UtilService();
    return Util.generateRandomString(0, 20, 0);
  }

  async verifyUserWithIdAndToken(userid: number, token: string): Promise<any> {
    //console.log("verifyUserWithIdAndToken=>"+userid);
    //console.log("verifyUserWithIdAndToken=>"+token);

    let data = {
      idUser: userid,
      accessToken: token,
    };

    let passport = await this.sql.run(
      this.passportSQL.getPassportDetailbyUserIdAndToken(),
      data,
    );
    return passport;
  }

  //if token expired then it will check refresh token and accesstoken available in
  //passport table then update entry with new accesstoken and refreshtoken
  async updatepassportwithnewtoken(
    _accesstoken: string,
    _refreshtoken: string,
  ) {
    console.log('updatepassportwithtoken==>' + _accesstoken);
    const passportdata = {
      refreshToken: _refreshtoken,
    };
    const result = await this.sql.run(
      this.passportSQL.getPassportDetailsbyRefreshToken(),
      passportdata,
    );
    console.log(result);

    if (result) {
      //const taccesstoken = _accesstoken;
      // const _idUser = this.utilService.getUserIdFromToken(taccesstoken);

      // const _eMail = this.utilService.getEmailFromToken(taccesstoken);
      // const _fName = this.utilService.getFNameFromToken(taccesstoken);
      const _idUser = result[0]['idUser'];
      const _eMail = result[0]['eMail'];
      const _fName = result[0]['fName'];

      console.log('email from token===>' + _eMail);

      const tokenData = { idUser: _idUser, fName: _fName, eMail: _eMail };
      const naccessToken = this.createToken(tokenData, null, null);

      const nrefreshToken = this.generateRefreshToken();

      console.log('New Access Token==>' + naccessToken);
      console.log('new refreshToken==>' + nrefreshToken);

      const updatetokenData = {
        newaccessToken: naccessToken,
        newrefreshToken: nrefreshToken,
        oldaccessToken: _accesstoken,
        oldrefreshToken: _refreshtoken,
      };

      const data = await this.sql.run(
        this.passportSQL.updatePassportBasedonRefreshToken(),
        updatetokenData,
      );
      if (data.affectedRows === 1) {
        const responseData = {
          success: 'T',
          data: {
            idUser: _idUser,
            accessToken: naccessToken,
            refreshToken: nrefreshToken,
            eMail: _eMail,
            fName: _fName,
          },
        };
        return responseData;
      }
    } else {
      throw new HttpException(
        { message: 'Token data not found', status: false },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
