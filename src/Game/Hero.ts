namespace Game {

    export class Hero implements Item {
        
        pos: SAT.Vector;
        width: number = 16;
        height: number = 24;
        speed: SAT.Vector;
        collider: SAT.Box;

        constructor(x: number, y: number) {
            this.pos = new SAT.Vector(x, y);
            this.speed = new SAT.Vector(0, 0);
            this.collider = new SAT.Box(this.pos, this.width, this.height);
        }

        render(ctx: CanvasRenderingContext2D): void  {
            ctx.fillStyle = '#f0f';
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }

        update(): void {
            this.pos.add(this.speed);
        }

    }

}