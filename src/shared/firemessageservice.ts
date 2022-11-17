import { Injectable } from '@nestjs/common';
var fireAdmin = require('firebase-admin');
import * as serviceAccount from '../../maint-fire-storage-sdk.json';
import { PayloadDto } from '../user_login/dto/user-login.dto';
import { UserService } from '../user/User.Service';

import { SQLService } from './../shared/SQLServices';
import { UserSQL } from './../sql/UserSQL';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

fireAdmin.initializeApp({
  credential: fireAdmin.credential.cert(serviceAccount),
});

@Injectable()
export class FireMessageServices {
  constructor(
    private readonly sql: SQLService,
    private readonly userQuery: UserSQL,
  ) {}
  //private readonly userService: UserService;
  async sendMaintNotification(
    _toUserId: number,
    _tittlemsg: string,
    _bodymsg: string,
    _breaktrnId: number,
  ) {
    //     userService = new UserService();
    // var registerToken =
    //   'eQEd_RiVTluQKfJ9W19qTo:APA91bGNNrHDvGo5PNxhwsd41IcYr7KKSwlmRt0yeGiBctuoM5k4H-C2IJ36tOD4EwinYK7gFgm8eA-xaIY8Ss7AEF_qK64Hlgkes2hqtqGintaKbGwv4UdF-RxMyiT3XKMe68ws-ZFw';
    // var registerToken =
    //   'crwuCcHpT8eQXmzZfhl9tw:APA91bHeD8s815E_mrce5VmgRtURtxp4yFqhcQahsMQ8KnymVvab0VfBrk6FFRVPZ3PYFR8VVoNgd7g-ygVrPsdxhte2XEDwZsqOgEW8_pkm7OTM_oewy4SVP4ETlbScavyitwgaUEnQ';
    //var registerToken = payloadDto.fireToken;
    var registerToken = '';
    var userName = '';
    console.log('Breaktrn id=>' + _breaktrnId);

    var data = await this.finduserDataforMsg(_toUserId);
    console.log(data);
    if (data) {
      userName = data[0]['fName'];
      registerToken = data[0]['fireToken'];
    }
    var payLoad = {
      notification: {
        title: _tittlemsg,
        body: 'Dear ' + userName + ', ' + _bodymsg,
      },
      data: {
        id: _breaktrnId.toString(),
      },
      // data: {
      //   MyKey1: 'hello',
      // },
    };
    var options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };

    fireAdmin
      .messaging()
      .sendToDevice(registerToken, payLoad, options)
      .then(function(response) {
        console.log('Successfully send message', response);
        var responseData = {
          success: 'T',
        };
        return responseData;
      })
      .catch(function(error) {
        console.log('Error sending message', error);
        var responseData = {
          success: 'F',
        };
        return responseData;
      });
  }

  async sendNotification(payloadDto: PayloadDto) {
    // var registerToken =
    //   'eQEd_RiVTluQKfJ9W19qTo:APA91bGNNrHDvGo5PNxhwsd41IcYr7KKSwlmRt0yeGiBctuoM5k4H-C2IJ36tOD4EwinYK7gFgm8eA-xaIY8Ss7AEF_qK64Hlgkes2hqtqGintaKbGwv4UdF-RxMyiT3XKMe68ws-ZFw';
    // var registerToken =
    //   'crwuCcHpT8eQXmzZfhl9tw:APA91bHeD8s815E_mrce5VmgRtURtxp4yFqhcQahsMQ8KnymVvab0VfBrk6FFRVPZ3PYFR8VVoNgd7g-ygVrPsdxhte2XEDwZsqOgEW8_pkm7OTM_oewy4SVP4ETlbScavyitwgaUEnQ';
    var registerToken = payloadDto.fireToken;
    var payLoad = {
      notification: {
        title: payloadDto.title,
        body: payloadDto.body,
      },
      data: payloadDto.data,
      // data: {
      //   MyKey1: 'hello',
      // },
    };
    var options = {
      priority: 'high',
      timeToLive: 60 * 60 * 24,
    };

    fireAdmin
      .messaging()
      .sendToDevice(registerToken, payLoad, options)
      .then(function(response) {
        console.log('Successfully send message', response);
        var responseData = {
          success: 'T',
        };
        return responseData;
      })
      .catch(function(error) {
        console.log('Error sending message', error);
        var responseData = {
          success: 'F',
        };
        return responseData;
      });
  }

  async finduserDataforMsg(id: number): Promise<any> {
    const userData = {
      idUser: id,
    };
    const user = await this.sql.run(
      this.userQuery.findUserDataforMsgq(),
      userData,
    );
    console.log(user);
    if (!user) {
      const error = { user: 'not found' };
      throw new HttpException({ error }, 401);
    } else {
      return user;
    }
  }
}
