import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Gift API')
    .setDescription('API for Gift app')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
  });

  app.enableCors({
    // origin: ['http://localhost:5173', 'https://gift.dubskilw.beget.tech/'],
    origin: '*',
    methods: '*',
    credentials: true,
  })

  await app.listen(5000);
}
bootstrap();
