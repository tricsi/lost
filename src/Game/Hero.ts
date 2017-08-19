namespace Game {

    export class Hero implements Item {
        
        collided: Vec = new Vec(0, 0);
        sprite: Sprite;
        speed: Vec;
        box: Box;
        face: number = 0;
        walk: boolean = true;
        frame: number = 1;

        constructor(x: number, y: number, sprite: Sprite) {
            this.sprite = sprite;
            this.speed = new Vec(0, 1);
            this.box = new Box(new Vec(x, y), 16, 24);
        }

        render(ctx: CanvasRenderingContext2D): void  {
            let box = this.box.clone(),
                pos = box.pos,
                x = pos.x,
                y = pos.y,
                w = box.w,
                h = box.h,
                top = this.face * h,
                walk = this.walk,
                frame = this.frame,
                sprite = this.sprite;
            if (walk) {
                frame = frame < 3 ? frame : 1;
                sprite.render(ctx, box, top, frame + 1);
            } else {
                sprite.render(ctx, box, top, 0);
                sprite.render(ctx, box, top, frame + 4);
            }
        }

        update(tick: number) {
            if (tick % 8 == 0) {
                if (!this.walk) {
                    this.frame = ++this.frame % 3;
                } else if (this.speed.x != 0) {
                    this.frame = ++this.frame % 4;
                }
            }
        }

    }

}