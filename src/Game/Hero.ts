namespace Game {

    export class Hero implements Item {
        
        speed: Vec;
        collider: Rect;

        constructor(x: number, y: number) {
            this.speed = new Vec(0, 1);
            this.collider = new Rect(new Vec(x, y), 16, 24);
        }

        render(ctx: CanvasRenderingContext2D): void  {
            const rect = this.collider;
            ctx.fillStyle = '#f0f';
            ctx.fillRect(rect.pos.x, rect.pos.y, rect.w, rect.h);
        }

        update(): void {
            this.collider.pos.add(this.speed);
        }

    }

}