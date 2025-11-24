import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Allow-Headers',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
      'Access-Control-Allow-Origin',
      'X-API-Key'
    ],
    exposedHeaders: [
      'Authorization',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Credentials'
    ],
    credentials: false,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  const config = new DocumentBuilder()
    .setTitle('Gift API')
    .setDescription('API for Gift app')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(5000);
  console.log('Application is running on: http://localhost:5000');
}
bootstrap();
