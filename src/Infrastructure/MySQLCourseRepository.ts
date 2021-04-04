import { CourseRepository } from '../Domain/CourseRepository';
import { Course } from '../Domain/Course';
import { createConnection } from 'typeorm';

export class MySQLCourseRepository extends CourseRepository {

    async nextIdentity(): Promise<number> {
      return new Promise((resolve) => {
        resolve(Math.floor(Date.now() / 1000));
      });
    }

    async save(course: Course) {
        const connection = await this.getConnection();

        const result = await connection.query(
          'INSERT INTO courses(id, name, places) VALUES(?, ?, ?)',
          [course.getId(), course.getName(), course.getPlaces()],
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