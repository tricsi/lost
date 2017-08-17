namespace Game {

    export class Hero {
        
        speed: Vec;
        box: Box;
        face: number = 0;
        walk: boolean = true;
        frame: number = 0;

        constructor(x: number, y: number) {
            this.speed = new Vec(0, 1);
            this.box = new Box(new Vec(x, y), 16, 24);
        }

        render(ctx: CanvasRenderingContext2D, sprite: Sprite, width: number): void  {
            let box = this.box,
                pos = box.pos;
            let frame = this.frame;
            if (this.walk) {
                frame = this.speed.x == 0 ? 3 : frame + 3;
            }
            sprite.render(ctx, pos.x, pos.y, box.w, box.h, this.face * box.h, frame);
            if (pos.x + box.w > width) {
                sprite.render(ctx, pos.x - width, pos.y, box.w, box.h, this.face * box.h, frame);
            }
        }

        update(tick: number) {
            if (tick % 8 == 0) {
                this.frame = ++this.frame % 3;
            }
        }

    }

}