import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { createConnection } from 'typeorm';
import { AppService } from './app.service';
import { ApiProperty, ApiTags, ApiQuery } from '@nestjs/swagger';

class CreateCourseRequest {
  @ApiProperty({ example: 'Nuevo curso' })
  name: string;
  @ApiProperty({ example: 5 })
  places: number;
}

class CreateStudentRequest {
  @ApiProperty({ example: 'Manolo' })
  name: string;
  @ApiProperty({ example: '12345678Q' })
  nif: string;
  @ApiProperty({ example: 'mtorres@ual.es' })
  email: string;
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


  @Get('/courses')
  @ApiTags('courses')
  @ApiQuery({ name: 'name', required: false })
  async getCourses(@Query('name') name: string): Promise<object> {
    const connection = await this.getConnection();

    let query = 'SELECT * FROM courses';
    let params = [];

    if (name !== undefined) {
      query += ' WHERE name = ?';
      params.push(name);
    }

    const result = await connection.query(query, params);

    connection.close();

    return result;
  }

  @Post('/students')
  @ApiTags('students')
  async createStudent(@Body() req: CreateStudentRequest): Promise<object> {
    if (req.name == undefined || req.name.length < 2 || req.name.length > 255) {
      throw new BadRequestException(
        'El nombre del estudiante tiene que tener entre 2 y 255 caracteress',
      );
    }
    if (req.nif == undefined || !/^[0-9]{8}[A-Z]$/g.test(req.nif)) {
      throw new BadRequestException('El NIF tiene que tener formato correcto');
    }
    if (
      req.email == undefined ||
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(
        req.email,
      )
    ) {
      throw new BadRequestException(
        'El email tiene que tener formato correcto',
      );
    }

    const connection = await this.getConnection();

    const result = await connection.query(
      'INSERT INTO students(name, nif, email) VALUES(?, ?, ?)',
      [req.name, req.nif, req.email],
    );

    connection.close();

    return {'id: ': result.insertId };
  }

  @Get('/students')
  @ApiTags('students')
  async getStudents(): Promise<object> {
    // connect DB
    const connection = await this.getConnection();

    const query = 'SELECT * FROM students ';

    const result = await connection.query(query);

    connection.close();

    return { data: result };
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
