import * as bcrypt from "bcrypt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class BcryptServices
{
    constructor() {}
    async encryptPassword(userPassword): Promise<string>
    {
        var resultString = "";
        const salt  = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(userPassword, salt);
        return hash;
    }

    async decryptPassword(userSuppliedPassword, hash): Promise<boolean>
    {
        return bcrypt.compareSync(userSuppliedPassword, hash);
    }
}
