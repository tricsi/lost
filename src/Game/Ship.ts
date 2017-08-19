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
                this.sprite.render(ctx, box, box.h * i, 0);
            });
        }

    }

}