namespace Game {

    export class Hero implements Item {
        
        speed: Vec;
        box: Box;

        constructor(x: number, y: number) {
            this.speed = new Vec(0, 1);
            this.box = new Box(new Vec(x, y), 16, 24);
        }

        render(ctx: CanvasRenderingContext2D): void  {
            const box = this.box;
            ctx.fillStyle = '#f0f';
            ctx.fillRect(box.pos.x, box.pos.y, box.w, box.h);
        }

    }

}