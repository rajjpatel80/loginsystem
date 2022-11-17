import { MaxLength } from 'class-validator';
import { join } from 'path';
import _ = require('lodash');
import { ObjectUnsubscribedError } from 'rxjs';

export class UserSQL {
  findByEmail() {
    return {
      name: `findByEmail`,
      type: `SELECT`,
      syntax: where => {
        const Allowedkeys = ['idUser', 'eMail', 'fName'];
        const email = _.get(where, 'eMail');
        const sql = `SELECT ${Allowedkeys.join()} FROM usermaster WHERE eMail = '${email}';`;
        console.log(sql);
        return sql;
      },
    };
  }

  findByCompanyName() {
    return {
      name: `findByCompanyName`,
      type: `SELECT`,
      syntax: where => {
        const Allowedkeys = ['idUser', 'comp_Id'];
        const comp_Id = _.get(where, 'comp_Id');
        const sql = `SELECT ${Allowedkeys.join()} FROM UserMaster WHERE comp_Id = '${comp_Id}';`;
        return sql;
      },
    };
  }

  addUser() {
    return {
      name: `addUser`,
      type: `INSERT`,
      syntax: where => {
        const Allowedkeys = [
          'eMail',
          'password',
          'userCat',
          'fName',
          'mName',
          'lName',
          'mobileNo',
          'address',
          'city_Id',
          'pinCode',
          'state_Id',
          'country_Id',
          'comp_Id',
          'rmk',
          'status',
          'createDate',
          'updateDate',
        ];
        const conds = _.pick(where, Allowedkeys);
        const keys = _.keys(conds);
        const values = _.values(conds);

        const sql = `INSERT INTO usermaster (${keys.join()}) VALUES ('${values.join(
          "','",
        )}')`;
        console.log(sql);

        return sql;
      },
    };
  }

  findUserDataforMsgq() {
    return {
      name: `findUserDataforMsgq`,
      type: `SELECT`,
      syntax: where => {
        let Allowedkeys = ['idUser'];

        const idUser = _.get(where, 'idUser');
        const sql = `SELECT u.idUser, u.fName, u.eMail, p.fireToken  FROM usermaster u LEFT JOIN passport p ON u.idUser = p.idUser WHERE u.idUser = '${idUser}';`;
        console.log(sql);
        return sql;
      },
    };
  }

  findByUserId() {
    return {
      name: `findByUserId`,
      type: `SELECT`,
      syntax: where => {
        let Allowedkeys = [
          'idUser',
          'eMail',
          'password',
          'userCat',
          'fName',
          'mName',
          'lName',
          'mobileNo',
          'address',
          'city_Id',
          'pinCode',
          'state_Id',
          'country_Id',
          'comp_Id',
          'rmk',

        ];
        const idUser = _.get(where, 'idUser');
        //console.log(idUser);
        const type = _.get(where, 'type');
        if (!type) {
          Allowedkeys = [...Allowedkeys, 'Status', 'createDate', 'updateDate'];
        }
        const sql = `SELECT ${Allowedkeys.join()} FROM usermaster WHERE idUser = '${idUser}';`;
        console.log(sql);
        return sql;
      },
    };
  }

  getAllUsers() {
    return {
      name: `getAllUsers`,
      type: `SELECT`,
      syntax: where => {
        const Allowedkeys = [
          'idUser',
          'eMail',
          'password',
          'userCat',
          'fName',
          'mName',
          'lName',
          'mobileNo',
          'address',
          'city_Id',
          'pinCode',
          'state_Id',
          'country_Id',
          'comp_Id',
          'rmk',
          'status',
          'createDate',
          'updateDate',
        ];
        const sql = `SELECT ${Allowedkeys.join()} FROM usermaster WHERE status = 'T'`;
        console.log(sql);
        return sql;
      },
    };
  }

  getAllUserdata() {
    return {
      name: `getAllUserData`,
      type: `SELECt`,
      syntax: where => {
        const Allowedkeys = ['idUser', 'eMail', 'fName'];
        const sql = `SELECT ${Allowedkeys.join()} FROM usermaster WHERE status = 'T'`;
        console.log(sql);
        return sql;
      },
    };
  }

  updateUser() {
    return {
      name: `updateUser`,
      type: `UPDATE`,
      syntax: where => {
        let sql = `UPDATE UserMaster SET `;
        const id = _.get(where, 'idUser');

        _.unset(where, 'idUser');
        console.log('Where=>' + Object.values(where));

        _.forEach(where, function(value, key) {
          if (value) {
            sql += `${key} = '${value}',`;
          } else {
            sql += `${key} = ${value},`;
          }
        });
        sql = sql.substring(0, sql.length - 1);
        sql += ` WHERE idUser = ${id}`;
        console.log(sql);
        return sql;
      },
    };
  }

  checkCompanyName() {
    return {
      name: `checkCompanyName`,
      type: `SELECT`,
      syntax: where => {
        const allowedKeys = [
          'idUser',
          'eMail',
          'password',
          'userCat',
          'fName',
          'mName',
          'lName',
          'mobileNo',
          'address',
          'city_Id',
          'pinCode',
          'state_Id',
          'country_Id',
          'comp_Id',
          'rmk',
          'status',
          'createDate',
          'updateDate',
        ];
        const idUser = _.get(where, 'idUser');
        const comp_Id = _.get(where, 'comp_Id');
        const sql = `SELECT ${allowedKeys.join()} FROM usermaster  WHERE idUser != '${idUser}' and CompanyName = '${comp_Id}';`;
        return sql;
      },
    };
  }

  resetPassword() {
    return {
      name: `resetPassword`,
      type: `UPDATE`,
      syntax: where => {
        const idUser = _.get(where, 'idUser');
        let sql = `UPDATE Passport SET `;
        const id = _.get(where, 'idUser');
        _.unset(where, 'idUser');
        const lastKey = Object.keys(where)[Object.keys(where).length - 1];
        _.mapKeys(where, (value, key) => {
          sql += `${key} = '${value}'`;
          sql += lastKey == key ? `` : `, `;
        });
        sql += ` WHERE idUser = ${id}`;
        return sql;
      },
    };
  }

  deleteUser() {
    return {
      name: `deleteUser`,
      type: `DELETE`,
      syntax: where => {
        const idUser = _.get(where, 'idUser');
        let sql = `DELETE FROM usermaster WHERE idUser = '${idUser}'`;
        console.log(sql);
        return sql;
      },
    };
  }  
}
