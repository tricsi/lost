namespace Game {

    export class Hero implements Item {
        
        speed: Vec;
        box: Box;
        face: number = 0;
        frame: number = 0;

        constructor(x: number, y: number) {
            this.speed = new Vec(0, 1);
            this.box = new Box(new Vec(x, y), 16, 24);
        }

        render(ctx: CanvasRenderingContext2D, sprite: Sprite): void  {
            let box = this.box;
            sprite.render(ctx, box.pos.x, box.pos.y, box.w, box.h, this.face * box.h, this.frame);
        }

        update(tick: number) {
            if (tick % 8 == 0) {
                this.frame = ++this.frame % 3;
            }
        }

    }

}