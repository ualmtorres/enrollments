import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { createConnection } from 'typeorm';
import { AppService } from './app.service';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

class CreateCourseRequest {
  @ApiProperty({ example: 'Nuevo curso' })
  name: string;
  @ApiProperty({ example: 5 })
  places: number;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/courses')
  @ApiTags('courses')
  async createCourse(@Body() body: CreateCourseRequest): Promise<object> {
    if (body.places === undefined || body.places < 1 || body.places > 8) {
      throw new BadRequestException(
        'El número de plazas de un curso deber estar entre 1 y 8'
      );
    }
    if (
      body.name === undefined ||
      body.name.length < 3 ||
      body.name.length > 255
    ) {
      throw new BadRequestException(
        'El nombre de un curso debe estar entre 3 y 255 caracteres',
      );
    }
    const connection = await this.getConnection();

    const result = await connection.query(
      'INSERT INTO courses(name, places) VALUES(?, ?)',
      [body.name, body.places],
    );

    connection.close();

    return { courseId: result.insertId };
  }

  getConnection() {
    return createConnection({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'secret',
      database: 'ual',
    });
  }
}
