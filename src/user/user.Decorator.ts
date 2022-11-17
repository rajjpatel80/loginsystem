
import { createParamDecorator } from "@nestjs/common";
import { JWT_SECRET_KEY } from "../config";
import * as jwt from "jsonwebtoken";


export const User = createParamDecorator((data, req) => {
    if(!!req.user)
    {
        return !!data ? req.user[data] : req.user;
    }

    const token = req.headers.authorization ? (req.headers.authorization as string).split(" ") : null;
    if(token && token[1]) 
    {
        const decoded: any = jwt.verify(token[1], JWT_SECRET_KEY);
        return !!data ? decoded[data] : decoded.User;
    }
});