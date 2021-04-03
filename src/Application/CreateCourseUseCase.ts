import { createConnection } from 'typeorm';
import { InvalidArgumentException } from '../Domain/InvalidArgumentException';
import { CourseRepository } from '../Domain/CourseRepository';
import { Course } from '../Domain/Course';
import { Injectable } from '@nestjs/common';
@Injectable()
export class CreateCourseUseCase {

    constructor(private courses: CourseRepository) { }

    public async execute (name: string, places: number) {

          const courseId = await this.courses.nextIdentity();
          const course = new Course(courseId, name, places);
          const result = await this.courses.save(course);

          return { courseId: result.insertId };
    }
}