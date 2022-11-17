import { Injectable } from '@nestjs/common';
import { JWT_SECRET_KEY } from '../config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UtilService {
  constructor() {}

  generateRandomString(letter, number, either) {
    var chars = [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', //letters
      '0123456789',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    ];

    return [letter, number, either]
      .map(function(len, i) {
        return Array(len)
          .fill(chars[i])
          .map(function(x) {
            return x[Math.floor(Math.random() * x.length)];
          })
          .join('');
      })
      .concat()
      .join('')
      .split('')
      .sort(function() {
        return 0.5 - Math.random();
      })
      .join('');
  }

  getDateFormat() {
    var date = new Date();
    var aaaa = date.getFullYear();
    var gg: any = date.getDate();
    var mm: any = date.getMonth() + 1;

    if (gg < 10) gg = '0' + gg;

    if (mm < 10) mm = '0' + mm;

    var cur_day = aaaa + '-' + mm + '-' + gg;

    var hours: any = date.getHours();
    var minutes: any = date.getMinutes();
    var seconds: any = date.getSeconds();

    if (hours < 10) hours = '0' + hours;

    if (minutes < 10) minutes = '0' + minutes;

    if (seconds < 10) seconds = '0' + seconds;

    return cur_day + ' ' + hours + ':' + minutes + ':' + seconds;
  }

  getUserIdFromToken(authorization) {
    if (!authorization) return null;

    const token = authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
    return decoded.user.idUser;
  }

  getEmailFromToken(authorization) {
    if (!authorization) return null;
    const token = authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
    return decoded.user.eMail;
  }

  getFNameFromToken(authorization) {
    if (!authorization) return null;
    const token = authorization.split(' ');
    const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
    return decoded.user.fName;
  }

  getOtherIdFromToken(authorization) {
    if (!authorization) return null;
    const token = authorization.split(' ')[1];
    const decoded: any = jwt.verify(token, JWT_SECRET_KEY);
    return decoded.other.id;
  }
}
