namespace Game {

    export class Platform implements Item {

        box: Box;

        constructor(x: number, y: number, width: number, height: number) {
            this.box = new Box(new Vec(x, y), width, height);
        }

        render(ctx: CanvasRenderingContext2D): void {
            const box = this.box;
            ctx.fillStyle = '#0ff';
            ctx.fillRect(box.pos.x, box.pos.y, box.w, box.h);
        }

    }

}