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

        add(vec: Vec): Vec;
        add(x: number, y:number): Vec;
        add(xOrVec: any, y?:number): Vec {
            if (xOrVec instanceof Vec) {
                this.x += xOrVec.x;
                this.y += xOrVec.y;
            } else {
                this.x += xOrVec;
                this.y += y;
            }
            return this;
        }

        sub(vec: Vec): Vec;
        sub(x: number, y:number): Vec;
        sub(xOrVec: any, y?:number): Vec {
            if (xOrVec instanceof Vec) {
                this.x -= xOrVec.x;
                this.y -= xOrVec.y;
            } else {
                this.x -= xOrVec;
                this.y -= y;
            }
            return this;
        }

        scale(value: number) {
            this.x *= value;
            this.y *= value;
            return this;
        }

        length(): number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        normalize(): Vec {
            var len = this.length();
            if (len > 0) {
                this.scale(1 / len);
            }
            return this;
        }
    }
}