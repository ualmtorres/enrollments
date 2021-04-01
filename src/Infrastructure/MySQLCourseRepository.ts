import { CourseRepository } from '../Domain/CourseRepository';
import { Course } from '../Domain/Course';
import { createConnection } from 'typeorm';

export class MySQLCourseRepository extends CourseRepository {

    async save(course: Course) {
        const connection = await this.getConnection();

        const result = await connection.query(
          'INSERT INTO courses(name, places) VALUES(?, ?)',
          [course.getName(), course.getPlaces()],
        );

        connection.close();

        return result;
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