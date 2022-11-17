import { Injectable } from '@nestjs/common';
import _ = require("lodash");
import { isRegExp } from 'util';

@Injectable()
export class ErrorServices
{
    constructor() { }
    
    validationErrorResponse(errorObj)
    {
        var errorList = _.map(errorObj, function(item)
        {
            var prop = { property: item.property, constrains: item.constraints};
            return prop;
        });
        return errorList;
    }
}