import { InvalidArgumentException } from './InvalidArgumentException';
export class Course {
    private id: number;
    private name: string;
    private places: number;

    constructor (id: number, name: string, places: number) {
        this.id = id;
        this.name = name;
        this.places = places;

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
    }

    public getId() {
      return this.id;
    }

    public getName() {
        return this.name
    }

    public getPlaces() {
        return this.places;
    }
}