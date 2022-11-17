import { MaxLength } from 'class-validator';
import { join } from 'path';
import _ = require('lodash');
import { ObjectUnsubscribedError } from 'rxjs';

export class TododetSQL{
    findbyID(){
        return {
        name: `findbyID`,
        type: `SELECT`,
        syntax: where => { 
            const Allowedkeys = ['id', 'tittle', 'description', 'status', 'userId', 'createDate', 'updateDate'];
            const id= _.get(where, 'id');

            const sql = `SELECT ${Allowedkeys.join()} FROM tododet where id = '${id}'`;
            console.log(sql);
            return sql;
        }
        };
    }

    findbyuserID(){
        return {
        name: `findbyuserID`,
        type: `SELECT`,
        syntax: where => { 
            const Allowedkeys = ['id', 'tittle', 'description', 'status', 'userId', 'createDate', 'updateDate'];
            const userid= _.get(where, 'userId');

            const sql = `SELECT ${Allowedkeys.join()} FROM tododet where userId = '${userid}'`;
            console.log(sql);
            return sql;
        }
        };
    }    

    findbyStatus(){
        return {
        name: `findbyStatus`,
        type: `SELECT`,
        syntax: where => { 
            const Allowedkeys = ['id', 'tittle', 'description', 'status', 'userId', 'createDate', 'updateDate'];
            const status= _.get(where, 'status');

            const sql = `SELECT ${Allowedkeys.join()} FROM tododet where status = '${status}'`;
            console.log(sql);
            return sql;
        }
        };
    }

    findbyTittle(){
      return {
      name: `findbyTittle`,
      type: `SELECT`,
      syntax: where => { 
          const Allowedkeys = ['id', 'tittle', 'description', 'status', 'userId', 'createDate', 'updateDate'];
          const tittle= _.get(where, 'tittle');

          const sql = `SELECT ${Allowedkeys.join()} FROM tododet where tittle = '${tittle}'`;
          console.log(sql);
          return sql;
      }
      };
  }    

    findAlltododet(){
        return{
            name: `findAlltododet`,
            type: `SELECT`,
            syntax: where =>{
                const Allowedkeys = ['id', 'tittle', 'description', 'status', 'userId', 'createDate', 'updateDate'];
                const sql = `SELECT ${Allowedkeys.join()} FROM tododet`;
                console.log(sql);
                return sql;                 
            }
        };
    }

    addtodoDet(){
        return{
            name:`addtodoDet`,
            type: `INSERT`,
            syntax: where =>{
                const Allowedkeys = ['tittle', 'description', 'status', 'userId', 'createDate', 'updateDate']; 
                const conds = _.pick(where, Allowedkeys);
                const keys = _.keys(conds);
                const values = _.values(conds);
                
                const sql = `INSERT INTO tododet (${keys.join()}) VALUES ('${values.join(
                    "','",
                  )}')`;
                  console.log(sql);
          
                  return sql;                
            }
        }
    }

    updatetodoDet(){
        return {
            name: `updatetodoDet`,
            type: `UPDATE`,
            syntax: where => {
              let sql = `UPDATE tododet SET `;
              const id = _.get(where, 'id');
      
              _.unset(where, 'id');
              console.log('Where=>' + Object.values(where));
      
              _.forEach(where, function(value, key) {
                if (value) {
                  sql += `${key} = '${value}',`;
                } else {
                  sql += `${key} = ${value},`;
                }
              });
              sql = sql.substring(0, sql.length - 1);
              sql += ` WHERE id = ${id}`;
              console.log(sql);
              return sql;
            },
          };        
    }

    deletetodoDet() {
        return {
          name: `deletetodoDet`,
          type: `DELETE`,
          syntax: where => {
            const id = _.get(where, 'id');
            let sql = `DELETE FROM tododet WHERE idUser = '${id}'`;
            console.log(sql);
            return sql;
          },
        };
      }    

}