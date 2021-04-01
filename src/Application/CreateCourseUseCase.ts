import { createConnection } from 'typeorm';
import { InvalidArgumentException } from '../Domain/InvalidArgumentException';
import { CourseRepository } from '../Domain/CourseRepository';
import { Course } from '../Domain/Course';
export class CreateCourseUseCase {

    constructor(private courses: CourseRepository) { }

    public async execute (name: string, places: number) {

          const course = new Course(name, places);
          const result = await this.courses.save(course);

          return { courseId: result.insertId };
    }
}