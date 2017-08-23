namespace Game {

    export class Platform {

        static sprite: Sprite;
        box: Box;
        color: number;

        constructor(x: number, y: number, width: number, color: number = 0) {
            this.box = new Box(new Vec(x, y), width, 8);
            this.color = color;
        }

        render(ctx: CanvasRenderingContext2D): void {
            if (this.color < 0) {
                return;
            }
            let top = this.color,
                box = this.box.clone(),
                num = Math.round(box.w / 8) - 1;
            box.w = 8;
            Platform.sprite.render(ctx, box, top, 0);
            for (let j = 1; j < num; j++) {
                box.pos.x += box.w;
                Platform.sprite.render(ctx, box, top, 1);
            }
            box.pos.x += box.w;
            Platform.sprite.render(ctx, box, top, 2);
        }

    }

}