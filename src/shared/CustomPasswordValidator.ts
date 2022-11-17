import { ValidatorConstraint, 
            ValidatorConstraintInterface,
            ValidationArguments, 
            } from 'class-validator';
import { Injectable } from '@nestjs/common';

@Injectable()
@ValidatorConstraint({ name: "CostomPasswordValidator", async: false})
export class CustomePasswordValidator implements ValidatorConstraintInterface
{
    validate(text: string, args: ValidationArguments)
    {
        const isLowerCaseContain = /[a-z]/.test(text);
        const isUpperCaseContain = /[A-Z]/.test(text);
        const isNumerContain= /[0-9]/.test(text);
        //const isLength = text.length;
        if( isLowerCaseContain && isUpperCaseContain && isNumerContain )
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments)
    {
        return "Text ($value) is no contain atleast 1 Lowercase or atleast 1 Uppercase or atleast 1 number or 8 character or more!";
    }
}
