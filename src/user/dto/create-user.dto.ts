import { IsNotEmpty, Validate, IsDefined, IsEmail, IsNumberString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CustomePasswordValidator } from "../../shared/CustomPasswordValidator";
import { CustomSingleWordValidator } from '../../shared/CustomSingleWordValidator';

export class CreateUserDto{
    idUser: number;

    @ApiProperty({ default: "abcd@examaple.com"})
    @IsEmail()
    @IsNotEmpty()
    eMail: string;

    @IsNotEmpty()
    @ApiProperty({ default: "Abcd@1234"})
    @Validate(CustomePasswordValidator)
    password: string;

    @IsNotEmpty()
    @ApiProperty({ default: "Abcd@1234"})
    @Validate(CustomePasswordValidator)
    userCat: string;    

    @IsNotEmpty()
    @IsDefined()
    @Validate(CustomSingleWordValidator)
    @ApiProperty({ default: "abc"})
    fName: string;

    @Validate(CustomSingleWordValidator)
    @ApiProperty({ default: "mno"})
    mName: string;

    @Validate(CustomSingleWordValidator)
    @ApiProperty({ default: "xyz"})
    lName: string;

    @ApiProperty({ default : "123456789"})
    @IsNotEmpty()
    @IsNumberString()
    mobileNo: string;

    @ApiPropertyOptional({default : "Company Name"})
    address: string;

    @ApiPropertyOptional({default : 0})
    city_Id: number;    

    @ApiPropertyOptional({default : 0})
    pinCode: number;    

    @ApiPropertyOptional({default : 0})
    state_Id: number;    

    @ApiPropertyOptional({default : 0})
    country_Id: number;

    @ApiPropertyOptional({default : 0})
    comp_Id: number;

    @ApiPropertyOptional({ default: ""})
    rmk: string;

    @ApiPropertyOptional({ default: "T"})
    status: string;

    @ApiPropertyOptional({ default : Date.now()})
    createDate : string;

    @ApiPropertyOptional({ default : Date.now()})
    updateDate: string;

}