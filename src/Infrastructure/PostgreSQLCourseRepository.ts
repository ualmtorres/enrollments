import { CourseRepository } from '../Domain/CourseRepository';
import { Course } from '../Domain/Course';
import { createConnection } from 'typeorm';

export class PostgreSQLCourseRepository extends CourseRepository {

    async nextIdentity():Promise<number> {
      const connection = await this.getConnection();

      const result = await connection.query(
        "SELECT nextval('courses_id');"
      );

      await connection.close();
      return new Promise((resolve) => {
        resolve(result[0].nextval);
      });
    }

    async save(course: Course) {
        const connection = await this.getConnection();
        const result = await connection.query(
          'INSERT INTO courses(id, name, places) VALUES($1, $2, $3)',
          [course.getId(), course.getName(), course.getPlaces()],
        );

        await connection.close();

        return result;
    }

    async all(name: string): Promise<Course[]> {
      const connection = await this.getConnection();

      let query = 'SELECT * FROM courses';
      let params = [];
  
      if (name !== undefined) {
        query += ' WHERE name = $1';
        params.push(name);
      }

      const result = await connection.query(
        query, params,
      );

      await connection.close();

      return result;
    }

    getConnection() {
        return createConnection({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'example',
          database: 'enrollments',
        });
      }
}