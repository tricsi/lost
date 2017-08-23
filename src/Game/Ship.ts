namespace Game {

    export class Ship {

        static sprite: Sprite;
        boxes: Box[];

        constructor(x, y) {
            this.boxes = [
                new Box(new Vec(x, y), 16, 16),
                new Box(new Vec(x, y + 16), 16, 16),
                new Box(new Vec(x, y + 32), 16, 16),
            ];
        }
        
        render(ctx: CanvasRenderingContext2D): void  {
            this.boxes.forEach((box, i) => {
                Ship.sprite.render(ctx, box, i, 0);
            });
        }

    }

}