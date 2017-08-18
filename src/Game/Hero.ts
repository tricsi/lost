namespace Game {

    export class Hero {
        
        sprite: Sprite;
        speed: Vec;
        box: Box;
        face: number = 0;
        walk: boolean = true;
        frame: number = 0;

        constructor(x: number, y: number, sprite: Sprite) {
            this.sprite = sprite;
            this.speed = new Vec(0, 1);
            this.box = new Box(new Vec(x, y), 16, 24);
        }

        render(ctx: CanvasRenderingContext2D, width: number): void  {
            let box = this.box,
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
                frame = this.speed.x != 0 ? frame : 0;
                sprite.render(ctx, x, y, w, h, top, frame + 1);
            } else {
                sprite.render(ctx, x, y, w, h, top, 0);
                sprite.render(ctx, x, y, w, h, top, frame + 4);
            }
            if (pos.x + box.w > width) {
                x -= width;
                if (walk) {
                    sprite.render(ctx, x, y, w, h, top, frame + 1);
                } else {
                    sprite.render(ctx, x, y, w, h, top, 0);
                    sprite.render(ctx, x, y, w, h, top, frame + 4);
                }
            }
        }

        update(tick: number) {
            if (tick % 8 == 0) {
                this.frame = ++this.frame % 3;
            }
        }

    }

}