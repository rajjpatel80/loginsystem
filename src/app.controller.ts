import { Controller, Get, Res, Req } from '@nestjs/common';
///import { fsRoot } from "../server-config";
import { AppService } from './app.service';
import  url   = require("url");
import { createReadStream } from "fs";
import { join } from "path";

@Controller()
export class AppController {

  // constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get("/upload/*")
  async serveAvatar(@Req() req, @Res() res): Promise<any>
  {
      const urlObject = url.parse(req.url, true);
      const filepath = decodeURI(urlObject.path).replace("/api/upload/", "");
      return res.sendFile(filepath, { root: "upload"});
  } 

  // @Get("/test")
  // getTest(@Res() response)
  // {
  //   const url = join(fsRoot(), "/upload/test.pdf");
  //   const data = createReadStream(url);
  //   response.setHeader("Content-Type", "application/pdf");
  //   response.setHeader9("Content-Disposition", "attachment: filename=another.pdf");
  //   data.pipe(response);
  // }
}
