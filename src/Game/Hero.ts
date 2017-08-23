namespace Game {

    export class Hero implements Item {
        
        static jetSprite: Sprite;
        static jetSfx: Sfx;
        static sprite: Sprite;
        collided: Vec = new Vec(0, 0);
        speed: Vec = new Vec(0, 1);
        box: Box;
        face: number = 0;
        color: number = 0;
        walk: boolean = true;
        frame: number = 1;
        lasers: Laser[] = [];

        constructor(x: number, y: number) {
            this.box = new Box(new Vec(x, y), 16, 24);
        }

        render(ctx: CanvasRenderingContext2D): void  {
            let box = this.box,
                top = this.color * 2 + this.face,
                frame = this.frame;
            if (this.walk) {
                frame = frame < 3 ? frame : 1;
                Hero.sprite.render(ctx, box, top, frame + 1);
            } else {
                Hero.sprite.render(ctx, box, top, 0);
            }
            this.lasers.forEach(laser => {
                laser.render(ctx);
            });
        }

        renderJet(ctx: CanvasRenderingContext2D): void {
            if (!this.walk) {
                Hero.jetSprite.render(ctx, this.box, this.face + 2, this.frame);
            }
        }

        update(tick: number) {
            this.walk = this.collided.y && this.speed.y > 0;
            if (tick % 8 == 0) {
                this.shot();
                if (!this.walk) {
                    this.frame = ++this.frame % 3;
                } else if (this.speed.x != 0) {
                    this.frame = ++this.frame % 4;
                }
            }
        }

        shot() {
            this.lasers.push(new Laser(this));
        }

    }

}