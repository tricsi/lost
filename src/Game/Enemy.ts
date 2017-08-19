namespace Game {

    export class Enemy implements Item {

        collided: Vec = new Vec(0, 0);
        sprite: Sprite;
        speed: Vec;
        frame: number = 0;
        walk: boolean = false;
        box: Box;

        constructor(pos: Vec, speed: Vec, sprite: Sprite) {
            this.box = new Box(pos, 16, 16);
            this.speed = speed;
            this.sprite = sprite;
        }

        render(ctx: CanvasRenderingContext2D): void  {
            this.sprite.render(ctx, this.box, 0, this.frame != 3 ? this.frame : 1);
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