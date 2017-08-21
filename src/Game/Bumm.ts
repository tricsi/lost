namespace Game {

    export class Bumm {

        sprite: Sprite;
        frame: number = 0;
        box: Box;
        end: boolean = false;

        constructor(pos: Vec, sprite: Sprite) {
            this.box = new Box(pos, 16, 16);
            this.sprite = sprite;
        }

        render(ctx: CanvasRenderingContext2D): void {
            if (this.frame < 3) {
                this.sprite.render(ctx, this.box, 1, this.frame);
            }
        }

        update(tick: number): void {
            if (tick % 4 == 0) {
                this.end = ++this.frame > 2;
            }
        }

    }
}