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
        flip: boolean;
        box: Box;

        constructor(sx: number, sy:number, type: number) {
            this.flip = Math.random() < .5;
            let x = this.flip ? 240 : 0,
                y = Math.round(Math.random() * 136) + 32;
            this.box = new Box(new Vec(x, y), 16, 16);
            this.speed = new Vec(this.flip ? -sx : sx, sy);
            this.color = Enemy.count++ % 4 + 1;
            this.type = type;
        }

        render(ctx: CanvasRenderingContext2D): void  {
            let i = this.type * 2,
                s = String(this.speed.x).charAt(0);
            if (this.flip && Enemy.sprites[i + 1] !== null) {
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