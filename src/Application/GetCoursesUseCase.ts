import { CourseRepository } from '../Domain/CourseRepository';
import { Injectable } from '@nestjs/common';
@Injectable()
export class GetCoursesUseCase {

    constructor(private courses: CourseRepository) { }

    public async execute (name: string) {

          const result = await this.courses.all(name);

          return { result };
    }
}