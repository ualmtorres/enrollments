export class Course {
    private id: number;
    private name: string;
    private places: number;

    constructor (name: string, places: number) {
        this.name = name;
        this.places = places;
    }

    public getName() {
        return this.name
    }

    public getPlaces() {
        return this.places;
    }
}