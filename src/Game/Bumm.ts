namespace Game {

    export class Bumm {

        static sprite: Sprite;
        static sfx: Sfx;
        frame: number = 0;
        box: Box;
        end: boolean = false;

        constructor(pos: Vec) {
            this.box = new Box(pos, 16, 16);
        }

        render(ctx: CanvasRenderingContext2D): void {
            if (this.frame < 3) {
                Bumm.sprite.render(ctx, this.box, 1, this.frame);
            }
        }

        update(tick: number): void {
            if (tick % 4 == 0) {
                this.end = ++this.frame > 2;
            }
        }

    }
}