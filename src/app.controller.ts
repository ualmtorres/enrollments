import { BadRequestException, Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { createConnection } from 'typeorm';
import { AppService } from './app.service';
import { ApiProperty, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CreateCourseUseCase } from './Application/CreateCourseUseCase';
import { MySQLCourseRepository } from './Infrastructure/MySQLCourseRepository';
import { GetCoursesUseCase } from './Application/GetCoursesUseCase';

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
class EnrollStudentRequest {
  @ApiProperty({ example: 1 })
  studentId: number;
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, 
    private useCase: CreateCourseUseCase,
    private getUseCase: GetCoursesUseCase) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/courses')
  @ApiTags('courses')
  async createCourse(@Body() req: CreateCourseRequest): Promise<object> {
    try {
      const result = await this.useCase.execute(req.name, req.places);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }


  @Get('/courses')
  @ApiTags('courses')
  @ApiQuery({ name: 'name', required: false })
  async getCourses(@Query('name') name: string): Promise<object> {
    try {
      const result = await this.getUseCase.execute(name);
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  @Post('/courses/:courseId/enrollments')
  @ApiTags('courses')
  async enrollStudent(
    @Body() req: EnrollStudentRequest,
    @Param('courseId') courseId: string,
  ): Promise<object> {
    // connect DB
    const connection = await this.getConnection();

    const courses = await connection.query(
      'SELECT * FROM courses WHERE id = ?',
      [courseId],
    );
    if (courses.length === 0) {
      connection.close();
      throw new BadRequestException('Curso no encontrado');
    }
    const course = courses[0];

    const students = await connection.query(
      'SELECT * FROM students WHERE id = ?',
      [req.studentId],
    );
    if (students.length === 0) {
      connection.close();
      throw new BadRequestException('Estudiante no encontrado');
    }

    const courseEnrollemnts = await connection.query(
      'SELECT * FROM enrollments WHERE id_course = ?',
      [courseId],
    );
    if (courseEnrollemnts.length === course.places) {
      connection.close();
      throw new BadRequestException('El curso est?? lleno');
    }
    courseEnrollemnts.forEach(enrollment => {
      if (enrollment.id_student === req.studentId)
        throw new BadRequestException('El estudiante ya est?? matriculado');
    });

    const result = await connection.query(
      'INSERT INTO enrollments(id_course, id_student) VALUES(?, ?)',
      [courseId, req.studentId],
    );

    connection.close();
    return { enrollmentId: result.insertId };
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
