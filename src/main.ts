import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar títulos de documnentación
  const options = new DocumentBuilder() 
    .setTitle('Enrollments REST API')
    .setDescription('Enrollments REST API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options); 

  // La ruta en que se sirve la documentación
  SwaggerModule.setup('docs', app, document); 

  await app.listen(3000);
}
bootstrap();
