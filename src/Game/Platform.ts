namespace Game {

    export class Platform implements Item {

        pos: SAT.Vector;
        width: number;
        height: number;
        collider: SAT.Box;

        constructor(x: number, y: number, width: number, height: number) {
            this.pos = new SAT.Vector(x, y);
            this.width = width;
            this.height = height;
            this.collider = new SAT.Box(this.pos, width, height);
        }

        render(ctx: CanvasRenderingContext2D): void {
            ctx.fillStyle = '#0ff';
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }

        update(): void {
        }

    }

}