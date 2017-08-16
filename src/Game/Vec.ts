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

        add(vec: Vec): Vec {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        }

        sub(vec: Vec): Vec {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        }

        scale(x, y): Vec {
            this.x *= x;
            this.y *= y;
            return this;
        }

        sign(): Vec {
            return new Vec(
                Math.sign(this.x),
                Math.sign(this.y)
            );
        }
    }
}