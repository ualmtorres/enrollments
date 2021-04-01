import { createConnection } from 'typeorm';
import { InvalidArgumentException } from '../Domain/InvalidArgumentException';
export class CreateCourseUseCase {
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
          const connection = await this.getConnection();
      
          const result = await connection.query(
            'INSERT INTO courses(name, places) VALUES(?, ?)',
            [name, places],
          );
      
          connection.close();
      
          return { courseId: result.insertId };
    }
}