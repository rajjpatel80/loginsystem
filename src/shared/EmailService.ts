import { Injectable } from "@nestjs/common";
import { EMAIL_SETTING } from "../config";
import { info } from "console";
const nodemailer = require("nodemailer");

@Injectable()
export class EmailService
{
    constructor() {}

    async sendEmail(mailOptions)
    {
        let transpoter = nodemailer.createTransport(EMAIL_SETTING);
        mailOptions.from = EMAIL_SETTING.auth.user;
        transpoter.sendMail(mailOptions, (error, info) => {
            if(error)
            {
                console.error("Error in send email. Please try after some time");
            }
            else
            {
                console.log("Message %s sent: %s", info.messageId, info.response);
            }
        });
    }
}