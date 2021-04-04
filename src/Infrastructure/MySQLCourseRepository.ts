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

    async all(name: string): Promise<Course[]> {
      const connection = await this.getConnection();

      let query = 'SELECT * FROM courses';
      let params = [];
  
      if (name !== undefined) {
        query += ' WHERE name = ?';
        params.push(name);
      }

      const result = await connection.query(
        query, params
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