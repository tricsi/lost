namespace Game {

    export class Ship {

        sprite: Sprite;
        boxes: Box[];

        constructor(x, y, sprite: Sprite) {
            this.sprite = sprite;
            this.boxes = [
                new Box(new Vec(x, y), 16, 16),
                new Box(new Vec(x, y + 16), 16, 16),
                new Box(new Vec(x, y + 32), 16, 16),
            ];
        }
        
        render(ctx: CanvasRenderingContext2D): void  {
            this.boxes.forEach((box, i) => {
                let pos = box.pos,
                    top = box.h * i + 88;
                this.sprite.render(ctx, pos.x, pos.y, box.w, box.h, top, 0);
            });
        }

    }

}