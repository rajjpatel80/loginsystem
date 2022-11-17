import { QueryRunner, getConnection } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SQLService
{
    constructor() {}
    async run(queryObj, data: any=null)
    {
        let query = queryObj.syntax(data);
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.connect();
        var result = await queryRunner.query(query);
        await queryRunner.release();
        return result;
    }
}