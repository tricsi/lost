namespace Game {

    export class Enemy implements Item {

        static sprites: Sprite[] = [];
        static count: number = 0;
        collided: Vec = new Vec(0, 0);
        speed: Vec;
        color: number;
        frame: number = 0;
        tick: number = 0;
        type: number;
        box: Box;

        constructor(sx: number, sy:number, type: number) {
            let face = Rand.get() >= .5,
                x = face ? 0 : 240,
                y = Math.round(Rand.get(136)) + 32;
            this.box = new Box(new Vec(x, y), 16, 16);
            this.speed = new Vec(face ? sx : -sx, sy);
            this.color = Enemy.count++ % 4 + 1;
            this.type = type;
        }

        render(ctx: CanvasRenderingContext2D): void  {
            let i = this.type * 2;
            if (this.speed.x < 0 && Enemy.sprites[i + 1] !== null) {
                i++;
            }
            Enemy.sprites[i].render(ctx, this.box, this.color, this.frame != 3 ? this.frame : 1);
        }

        update(tick: number): void {
            if (this.tick++ % 7 == 0) {
                this.frame = ++this.frame % 3;
            }
        }

    }

}