import { IsNumberString, IsNotEmpty, IsEmail, IsDefined, Validate, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { CustomSingleWordValidator } from "../../shared/CustomSingleWordValidator";

export class UpdateUserDto
{
    @IsNotEmpty()
    @ApiProperty({ default: "1"})
    idUser: number;

    @ApiProperty({default: "abc@xyz.com"})
    @IsEmail()
    @IsNotEmpty()
    eMail: string;

    @IsNotEmpty()
    @IsDefined()
    @Validate(CustomSingleWordValidator)
    @ApiProperty({ default: ""})
    fName: string;

    @Validate(CustomSingleWordValidator)
    @ApiProperty( { default: ""})
    mName: string;

    @Validate(CustomSingleWordValidator)
    @ApiProperty( { default: ""})
    lName: string;

    @ApiProperty({ default : ""})
    @IsNotEmpty()
    @IsNumberString()
    mobileNo: string;

    @ApiPropertyOptional({default: ''})
    address: string;

    @ApiPropertyOptional({ default: 0})
    city_Id: number;

    @ApiPropertyOptional({ default: 0})
    pinCode: number;

    @ApiPropertyOptional({ default: 0})
    state_Id: number;

    @ApiPropertyOptional({ default: 0})
    country_Id: number;

    @ApiPropertyOptional({ default: 0})
    comp_Id: number;

    @ApiPropertyOptional({ default: ""})
    rmk: string;

    @ApiPropertyOptional({ default: "T"})
    status: string;

    @ApiPropertyOptional({ default : Date.now()})
    createDate : string;

    @ApiPropertyOptional({ default : Date.now()})
    updateDate: string;
        
    // @ApiPropertyOptional({ default: "12 MB"})
    // storageUsed: string;

    // @MaxLength(100)
    // @ApiPropertyOptional({ default: "line 1"})
    // addressLine1: string;

    // @MaxLength(100)
    // @ApiPropertyOptional({ default: "line 2"})
    // addressLine2: string;

    // @ApiPropertyOptional({ default: "1"})
    // idCityMaster: string;

    // @ApiPropertyOptional({ default: "1"})
    // idStateMaster: string;

    // @MaxLength(10)
    // @ApiPropertyOptional({ default: "394230"})
    // pinCode: string;
}