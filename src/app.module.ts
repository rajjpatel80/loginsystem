import { UserLoginModule } from './user_login/user_login.module';
import { UserModule } from './user/user.module';


import { Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import { ConfigModule, ConfigService } from '@nestjs/config';




import { AppController } from './app.controller';
import { AppService } from './app.service';
import { async } from 'rxjs/internal/scheduler/async';

const ENV = process.env.NODE_ENV;
console.log(
  !ENV ? '.env.sample' : ENV === 'production' ? '.env.' : `.env.${ENV}`,
);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        !ENV ? '.env.sample' : ENV === 'production' ? '.env.' : `.env.${ENV}`,
      ],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'testing', 'staging')
          .default('development'),
        PORT: Joi.number().default(5000),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigService],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        let data = {
          type: 'mysql' as 'mysql',

          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'todo',
          //authSource: "admin",
          synchronize: true,
          entities: ['dist/**/**.entity{.ts,.js}'],
        };
        //console.log("*******"+JSON.stringify(data));
        return data;
      },
    }),


    UserModule,
    UserLoginModule,
    
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure() {}
}
