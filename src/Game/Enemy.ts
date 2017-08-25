namespace Game {

    export class Enemy implements Item {

        static sprite: Sprite;
        collided: Vec = new Vec(0, 0);
        speed: Vec;
        color: number;
        frame: number = 0;
        box: Box;

        constructor(pos: Vec, speed: Vec, color: number = 0) {
            this.box = new Box(pos, 16, 16);
            this.speed = speed;
            this.color = color;
        }

        render(ctx: CanvasRenderingContext2D): void  {
            Enemy.sprite.render(ctx, this.box, this.color, this.frame != 3 ? this.frame : 1);
        }

        update(tick: number): void {
            if (tick % 8 == 0) {
                this.frame = ++this.frame % 3;
            }
            if (this.collided.y) {
                this.speed.y = -this.speed.y;
            }
            if (this.collided.x) {
                this.speed.x = -this.speed.x;
            }
        }

    }

}