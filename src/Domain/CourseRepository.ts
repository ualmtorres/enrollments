import { Course } from './Course';

export abstract class CourseRepository {
    abstract save(course: Course);
    // Aquí irían otros métodos p.e courseByStudent

    abstract nextIdentity(): Promise<number>;
}