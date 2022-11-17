import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  const port = process.env.TODO_PORT || 1000;
  //console.log('Port ->' + port);
  app.setGlobalPrefix('todo');
  const options = new DocumentBuilder()
    .setTitle('Nestjs Application...')
    .setDescription('To Do Api...')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/todo', app, document);
  await app.listen(port); //app.listen(5000);
}

bootstrap();

