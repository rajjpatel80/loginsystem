
import { 
        ValidatorConstraint,
        ValidatorConstraintInterface,
        ValidationArguments
} from "class-validator";
import { Injectable } from "@nestjs/common";
import _ = require("lodash");

@Injectable()
@ValidatorConstraint({ name: "CustomeSingleWordValidator", async: false})
export class CustomSingleWordValidator implements ValidatorConstraintInterface
{
    validate(text: string , args: ValidationArguments)
    {
        const numberOfText = _.words(text);

        if(numberOfText.length <= 1 )
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        return "Text ($value) should be only one word";
    }
}
