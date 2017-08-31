namespace Game {

    class Part implements Item {

        collided: Vec = new Vec(0, 0);
        speed: Vec = new Vec(0, .5);
        box: Box;
        top: number;
        
        constructor(pos: Vec, top: number) {
            this.box = new Box(pos, 16, 16);
            this.top = top;
        }

        render(ctx: CanvasRenderingContext2D): void {}

        update(tick: number): void {}

    }

    export class Fuel implements Item {

        static sprite: Sprite;
        collided: Vec = new Vec(0, 0);
        speed: Vec = new Vec(0, .5);
        box: Box;
        
        constructor() {
            let x = Math.round(Math.random() * 30) * 8;
            this.box = new Box(new Vec(x, 16), 16, 12);
        }

        render(ctx: CanvasRenderingContext2D): void {
            Fuel.sprite.render(ctx, this.box, 1, 0);
        }

        update(tick: number): void {}

    }

    export class Ship implements Item {

        static jetSprite: Sprite;
        static sprite: Sprite;
        static buildSfx: Sfx;
        static landSfx: Sfx;
        static goSfx: Sfx;
        collided: Vec = new Vec(0, 0);
        speed: Vec = new Vec(0, -1);
        box: Box;
        fuel: Fuel = new Fuel();
        fuels: number = 6;
        parts: Part[];
        status: number;
        tick: number = 0;
        type: number;

        constructor(type: number, pos: Vec, pos1: Vec = null, pos2: Vec = null) {
            this.box = new Box(pos, 16, 48);
            if (pos1) {
                this.status = 1;
            } else {
                this.status = 3;
                Ship.landSfx.play();
            }
            this.parts = [
                new Part(pos.clone().add(0, 32), 2),
                new Part(pos1 || pos.clone().add(0, 16), 1),
                new Part(pos2 || pos.clone(), 0),
            ];
            this.type = type;
        }
        
        complete(): boolean {
            return this.status >= this.parts.length;
        }

        ready(): boolean {
            return this.status == this.parts.length + this.fuels;
        }

        land(): boolean {
            return this.box.pos.y == 136;
        }

        go(): boolean {
            return this.status > this.parts.length + this.fuels;
        }

        gone(): boolean {
            return this.go() && this.box.pos.y <= -120;
        }

        render(ctx: CanvasRenderingContext2D): void  {
            let frame = this.type;
            if (this.ready() || this.go()) {
                Ship.sprite.render(ctx, this.box, Math.floor(this.tick % 4 / 2), frame);
            } else if (this.complete()) {
                let box = this.box.clone(),
                    fuels = this.fuels,
                    status = fuels - (this.status - this.parts.length);
                box.h /= fuels;
                for (let i = 0; i < fuels; i++) {
                    let top = status > i ? i : i + fuels;
                    Ship.sprite.render(ctx, box, top, frame);
                    box.pos.y += box.h;
                }
                if (this.land()) {
                    this.fuel.render(ctx);
                }
            } else {
                this.parts.forEach((part, i) => {
                    Ship.sprite.render(ctx, part.box, part.top, frame);
                });
            }
            if (!this.land() || this.go()) {
                let box = this.box.clone();
                box.pos.y += box.h;
                box.h = 16;
                Ship.jetSprite.render(ctx, box, 1, this.tick % 3);
            }
        }

        update(tick: number): void {
            if (tick % 8 == 0) {
                this.tick++;
            }
            if (this.go()) {
                this.box.pos.add(this.speed);
            } else if (!this.land()) {
                this.box.pos.sub(this.speed);
                this.parts[0].box.pos.sub(this.speed);
            }
        }
    }

}