namespace Game {

    export class Platform {

        box: Box;
        sprite: Sprite;
        color: number;

        constructor(x: number, y: number, width: number, sprite: Sprite, color: number = 0) {
            this.box = new Box(new Vec(x, y), width, 8);
            this.sprite = sprite;
            this.color = color;
        }

        render(ctx: CanvasRenderingContext2D): void {
            if (!this.sprite) {
                return;
            }
            let top = this.color,
                box = this.box.clone(),
                num = Math.round(box.w / 8) - 1;
            box.w = 8;
            this.sprite.render(ctx, box, top, 0);
            for (let j = 1; j < num; j++) {
                box.pos.x += box.w;
                this.sprite.render(ctx, box, top, 1);
            }
            box.pos.x += box.w;
            this.sprite.render(ctx, box, top, 2);
        }

    }

}