import { BadRequestException } from '@nestjs/common';
import { createConnection } from 'typeorm';
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

    public async execute (req) {
        if (req.places === undefined || req.places < 1 || req.places > 8) {
            throw new BadRequestException(
              'El número de plazas de un curso deber estar entre 1 y 8'
            );
          }
          if (
            req.name === undefined ||
            req.name.length < 3 ||
            req.name.length > 255
          ) {
            throw new BadRequestException(
              'El nombre de un curso debe estar entre 3 y 255 caracteres',
            );
          }
          const connection = await this.getConnection();
      
          const result = await connection.query(
            'INSERT INTO courses(name, places) VALUES(?, ?)',
            [req.name, req.places],
          );
      
          connection.close();
      
          return { courseId: result.insertId };
    }
}