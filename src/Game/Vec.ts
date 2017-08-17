namespace Game {

    export class Vec {

        x: number;
        y: number;

        constructor(x: number, y: number) {
            this.x = x;
            this.y = y;
        }

        clone(): Vec {
            return new Vec(this.x, this.y);
        }
    }
}