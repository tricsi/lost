namespace Game {

    export class Bumm {

        static sprite: Sprite;
        static sfx: Sfx;
        frame: number = 0;
        color: number;
        box: Box;
        end: boolean = false;

        constructor(pos: Vec, color: number = 0, sfx: boolean = false) {
            this.color = color;
            this.box = new Box(pos, 16, 16);
            if (sfx) {
                Bumm.sfx.play();
            }
        }

        render(ctx: CanvasRenderingContext2D): void {
            if (this.frame < 3) {
                Bumm.sprite.render(ctx, this.box, this.color, this.frame);
            }
        }

        update(tick: number): void {
            if (tick % 4 == 0) {
                this.end = ++this.frame > 2;
            }
        }

    }
}