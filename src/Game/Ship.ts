namespace Game {

    class Part implements Item {

        collided: Vec = new Vec(0, 0);
        speed: Vec = new Vec(0, .5);
        box: Box;
        top: number;
        
        constructor(pos: Vec, top: number) {
            this.box = new Box(pos, 16, 16);
            this.top = top;
        }

        render(ctx: CanvasRenderingContext2D): void {
            Ship.sprite.render(ctx, this.box, this.top, 0);
        }

        update(tick: number): void {
        }

    }

    export class Ship {

        static sprite: Sprite;
        parts: Item[];
        status: number;

        constructor(pos: Vec, pos1: Vec = null, pos2: Vec = null) {
            this.status = pos1 ? 1 : 3;
            this.parts = [
                new Part(pos.clone().add(0, 32), 2),
                new Part(pos1 || pos.clone().add(0, 16), 1),
                new Part(pos2 || pos.clone(), 0),
            ];
        }
        
        render(ctx: CanvasRenderingContext2D): void  {
            this.parts.forEach((part, i) => {
                part.render(ctx);
            });
        }

    }

}