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
        shoot: boolean = false;
        frame: number = 1;
        lasers: Laser[] = [];
        jetSound: AudioBufferSourceNode = null;
        
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

        update(scene: Scene) {
            scene.move(this);

            this.walk = this.collided.y && this.speed.y > 0;
            if (scene.tick % 8 == 0) {
                if (this.shoot) {
                    this.shot();
                }
                if (!this.walk) {
                    this.frame = ++this.frame % 3;
                } else if (this.speed.x != 0) {
                    this.frame = ++this.frame % 4;
                }
            }

            if (this.walk && this.jetSound) {
                this.jetSound.stop();
                this.jetSound = null;
            }
            if (!this.walk && !this.jetSound) {
                this.jetSound = Hero.jetSfx.play(.1, true);
            }

            let i = 0;
            while (i < this.lasers.length) {
                let laser = this.lasers[i];
                laser.update(scene);
                if (laser.end) {
                    this.lasers.splice(i, 1);
                } else {
                    i++;
                }
            }
        }

        shot() {
            this.lasers.push(new Laser(this));
        }

    }

}