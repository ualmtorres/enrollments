import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateCourseUseCase } from './Application/CreateCourseUseCase';
import { MySQLCourseRepository } from './Infrastructure/MySQLCourseRepository';
import { CourseRepository } from './Domain/CourseRepository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, 
    CreateCourseUseCase,
    {provide: CourseRepository, useClass: MySQLCourseRepository}],
})
export class AppModule {}
