import { createConnection } from 'typeorm';
import { InvalidArgumentException } from '../Domain/InvalidArgumentException';
import { CourseRepository } from '../Domain/CourseRepository';
import { Course } from '../Domain/Course';
export class CreateCourseUseCase {

    constructor(private courses: CourseRepository) { }

    public async execute (name: string, places: number) {
        if (places === undefined || places < 1 || places > 8) {
            throw new InvalidArgumentException (
              'El número de plazas de un curso deber estar entre 1 y 8'
            );
          }
          if (
            name === undefined ||
            name.length < 3 ||
            name.length > 255
          ) {
            throw new InvalidArgumentException (
              'El nombre de un curso debe estar entre 3 y 255 caracteres'
            );
          }

          const course = new Course(name, places);
          const result = await this.courses.save(course);
      
          return { courseId: result.insertId };
    }
}