namespace Game {

    export class Hero implements Item {
        
        collided: Vec = new Vec(0, 0);
        jetSprite: Sprite;
        sprite: Sprite;
        speed: Vec;
        box: Box;
        face: number = 0;
        color: number = 0;
        walk: boolean = true;
        frame: number = 1;

        constructor(x: number, y: number, sprite: Sprite, jetSprite: Sprite) {
            this.jetSprite = jetSprite;
            this.sprite = sprite;
            this.speed = new Vec(0, 1);
            this.box = new Box(new Vec(x, y), 16, 24);
        }

        render(ctx: CanvasRenderingContext2D): void  {
            let box = this.box,
                top = this.color * 2 + this.face,
                frame = this.frame;
            if (this.walk) {
                frame = frame < 3 ? frame : 1;
                this.sprite.render(ctx, box, top, frame + 1);
            } else {
                this.sprite.render(ctx, box, top, 0);
            }
        }

        renderJet(ctx: CanvasRenderingContext2D): void {
            if (!this.walk) {
                this.jetSprite.render(ctx, this.box, this.face + 2, this.frame);
            }
        }

        update(tick: number) {
            if (tick % 8 == 0) {
                if (!this.walk) {
                    this.frame = ++this.frame % 3;
                } else if (this.speed.x != 0) {
                    this.frame = ++this.frame % 4;
                }
            }
        }

    }

}