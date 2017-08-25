namespace Game {

    export class Hero implements Item {
        
        static jetSprite: Sprite;
        static jetSfx: Sfx;
        static sprite: Sprite;
        collided: Vec;
        speed: Vec;
        pos: Vec;
        box: Box;
        face: number = 0;
        walk: boolean;
        shoot: boolean;
        tick: number;
        frame: number;
        lasers: Laser[] = [];
        jetSound: AudioBufferSourceNode = null;
        
        constructor(x: number, y: number) {
            this.pos = new Vec(x, y);
            this.box = new Box(null, 16, 24);
            this.spawn(-100);
        }

        spawn(tick: number = -200): void {
            this.tick = tick;
            this.walk = true;
            this.face = 0;
            this.frame = 1;
            this.shoot = false;
            this.speed = new Vec(0, 1);
            this.collided = new Vec(0, 1);
            this.box.pos = this.pos.clone();
        }

        inactive(): boolean {
            return this.tick < -100;
        }

        spawning(): boolean {
            return this.tick < 0;
        }

        render(ctx: CanvasRenderingContext2D): void  {
            let box = this.box,
                frame = this.frame;
            this.lasers.forEach(laser => {
                laser.render(ctx);
            });
            if (this.inactive()) {
                return;
            }
            if (this.spawning() && this.tick % 30 < -15) {
                ctx.globalAlpha = .3;
            }
            if (this.walk) {
                frame = frame < 3 ? frame : 1;
                Hero.sprite.render(ctx, box, this.face, frame + 1);
            } else {
                Hero.sprite.render(ctx, box, this.face, 0);
            }
            if (!this.walk) {
                Hero.jetSprite.render(ctx, this.box, this.face + 2, this.frame);
            }
            ctx.globalAlpha = 1;
        }

        update(tick: number) {
            if (tick % 8 == 0) {
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
            this.tick++;
        }

        shot() {
            this.lasers.push(new Laser(this));
        }

    }

}