namespace Game {

    export class Laser implements Item {

        static sprite1: Sprite;
        static sprite2: Sprite;
        static sfx: Sfx;
        collided: Vec = new Vec(0, 0);
        speed: Vec = new Vec(-6, 0);
        box: Box;
        end: boolean = false;
        add: number = 5;
        width: number = 112;
        color: number;
        face: number;
        tick: number = 15;

        constructor(hero: Hero) {
            let box = hero.box.clone(),
                pos = box.pos;
            if (hero.face) {
                this.speed.x = -this.speed.x;
                pos.x += box.w;
            } else {
                pos.x -= this.add;
            }
            pos.y += 12;
            box.h = 1;
            box.w = this.add;
            this.box = box;
            this.color = Math.round(Math.random() * 2) + 1;
            this.face = hero.face;
            Laser.sfx.play(.5);
        }

        render(ctx: CanvasRenderingContext2D): void {
            const box = this.box;
            if (this.face) {
                Laser.sprite2.render(ctx, box, this.color, 0, this.width - box.w);
            } else {
                Laser.sprite1.render(ctx, box, this.color, 0);
            }
        }

        update(tick: number): void {
            let box = this.box,
                add = --this.tick < 0 ? -this.add : this.add;
            box.w += add;
            if (this.face) {
                box.pos.x -= add;
            }
            this.end = box.w <= this.add;
        }

    }
}