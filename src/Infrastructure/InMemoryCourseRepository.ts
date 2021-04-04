import { Course } from 'src/Domain/Course';
import { CourseRepository } from '../Domain/CourseRepository';
import { resolve } from 'path';
export class InMemoryCourseRepository extends CourseRepository {

    private courses = [];

    save(course: Course) {
        this.courses.push(course);
        return course;
    }
    async nextIdentity(): Promise<number> {
        return new Promise( (resolve) => {
            resolve(Math.floor(Date.now() / 1000));
        });
    }

    async all(name: string): Promise<Course[]> {
        return new Promise( (resolve) => {
            resolve(this.courses);
        });
    }
}
