import _ = require('lodash');

export class PassportSQL {
  addPassport() {
    return {
      name: `addPassport`,
      type: `INSERT`,
      syntax: where => {
        const allowedKeys = [
          'idUser',
          'eMail',
          'password',
          'userCat',
          'accessToken',
          'refreshToken',
          'protocol',
          'provider',
          'status',
          'createDate',
          'updateDate',
        ];
        const conds = _.pick(where, allowedKeys);
        const keys = _.keys(conds);
        const values = _.values(conds);
        const sql = `Insert INTO passport (${keys.join()}) VALUES  ('${values.join(
          "','",
        )}')`;
        console.log(sql);
        return sql;
      },
    };
  }

  getPassportDetailByUserId() {
    return {
      name: `getPassportDetailByUserId`,
      type: `SELECT`,
      syntax: where => {
        const allowedKeys = [
          'idUser',
          'eMail',
          'password',
          'userCat',
          'accessToken',
          'refreshToken',
          'protocol',
          'provider',
          'status',
          'createDate',
          'updateDate',
        ];
        const idUser = _.get(where, 'idUser');
        const sql = `SELECT ${allowedKeys.join()} FROM passport WHERE idUser ='${idUser}'`;
        console.log(sql);
        return sql;
      },
    };
  }

  getPassportDetailbyUserIdAndToken() {
    return {
      name: `getPassportDetailbyUserIdAndToken`,
      type: `SELECT`,
      syntax: where => {
        const allowedKeys = [
          'passport.idUser',
          'passport.accessToken',
          'passport.refreshToken',
          'usermaster.status',
        ];
        const idUser = _.get(where, 'idUser');
        const accessToken = _.get(where, 'accessToken');
        const sql = `SELECT ${allowedKeys.join()} FROM passport INNER JOIN usermaster on passport.idUser = usermaster.idUser WHERE usermaster.status = 'T' and passport.idUser = '${idUser}' and passport.accessToken = '${accessToken}'`;
        console.log(sql);
        return sql;
      },
    };
  }

  updateTokenWhenLogin() {
    return {
      name: `updateTokenWhenLogin`,
      type: `UPDATE`,
      syntax: where => {
        //const idUser = _.get(where, "idUser");

        let sql = `UPDATE passport SET `;
        const id = _.get(where, 'idUser');
        _.unset(where, 'idUser');

        // const lastkey = Object.keys(where)[Object.keys(where).length -1];
        // _.mapkeys(where, (value, key) => {
        //     sql += `${key} = '${value}'`;
        //     sql += lastkey == key ? `` : `,`;
        // });
        // sql += ` WHERE idUser = ${id}`;
        _.forEach(where, function(value, key) {
          if (value) {
            sql += `${key} = '${value}',`;
          } else {
            sql += `${key} = ${value}, `;
          }
        });

        sql = sql.substring(0, sql.length - 1);
        sql += ` WHERE idUser = ${id}`;
        console.log(sql);
        return sql;
      },
    };
  }

  updatePassportBasedonRefreshToken() {
    return {
      name: `updatePassportBasedonRefreshToken`,
      type: `UPDATE`,
      syntax: where => {
        const AllowedKeys = [
          'newaccessToken',
          'newrefreshToken',
          'oldaccessToken',
          'oldrefreshToken',
        ];

        let sql = `UPDATE passport SET `;
        let _accessToken = _.get(where, 'oldaccessToken');
        let _refreshToken = _.get(where, 'oldrefreshToken');
        let _newaccessToken = _.get(where, 'newaccessToken');
        let _newrefreshToken = _.get(where, 'newrefreshToken');

        sql += ` accessToken='${_newaccessToken}'`;
        sql += ` , refreshToken ='${_newrefreshToken}'`;
        sql += ` where refreshToken ='${_refreshToken}'`;
        //sql += ` and accessToken ='${_accessToken}' `;
        console.log(sql);
        return sql;
      },
    };
  }

  getPassportDetailsbyRefreshToken() {
    return {
      name: `getPassportDetailsbyRefreshToken`,
      type: `SELECT`,
      syntax: where => {
        const AllowedKeys = [
          'p.idUser',
          'u.fName',
          'p.eMail',
          'p.password',
          'p.userCat',
          'p.accessToken',
          'p.refreshToken',
          'p.protocol',
          'p.provider',
          'p.status',
          'p.createDate',
          'p.updateDate',
        ];
        const _refreshToken = _.get(where, 'refreshToken');
        const sql = `SELECT ${AllowedKeys.join()} FROM passport p LEFT JOIN usermaster u ON u.idUser = p.idUser where p.refreshToken='${_refreshToken}'`;
        console.log(sql);
        return sql;
      },
    };
  }
}
