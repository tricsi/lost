namespace Game {

    export class Platform {

        box: Box;

        constructor(x: number, y: number, width: number, height: number) {
            this.box = new Box(new Vec(x, y), width, height);
        }

        render(ctx: CanvasRenderingContext2D, sprite: Sprite): void {
            const box = this.box;
            ctx.fillStyle = '#0ff';
            ctx.fillRect(box.pos.x, box.pos.y, box.w, box.h);
        }

    }

}