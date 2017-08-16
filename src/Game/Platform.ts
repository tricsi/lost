namespace Game {

    export class Platform implements Item {

        collider: Rect;

        constructor(x: number, y: number, width: number, height: number) {
            this.collider = new Rect(new Vec(x, y), width, height);
        }

        render(ctx: CanvasRenderingContext2D): void {
            const rect = this.collider;
            ctx.fillStyle = '#0ff';
            ctx.fillRect(rect.pos.x, rect.pos.y, rect.w, rect.h);
        }

        update(): void {
        }

    }

}