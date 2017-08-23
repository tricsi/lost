namespace Game {

    export class Laser implements Item {

        static sprite: Sprite;
        collided: Vec = new Vec(0, 0);
        speed: Vec = new Vec(-8, 0);
        box: Box;
        end: boolean = false;
        add: number = 6;
        width: number = 112;
        color: number;

        constructor(hero: Hero) {
            let box = hero.box.clone(),
                pos = box.pos,
                w = 80;
            if (hero.face) {
                this.speed.x = -this.speed.x;
                pos.x += box.w;
            } else {
                pos.x -= w;
            }
            pos.y += 12;
            box.h = 1;
            box.w = w;
            this.box = box;
            this.color = Math.round(Math.random() * 3) + 1;
        }

        render(ctx: CanvasRenderingContext2D): void {
            Laser.sprite.render(ctx, this.box, this.color, 0);
        }

        update(tick: number): void {
            let box = this.box,
                pos = box.pos;
            box.w += this.add;
            if (this.speed.x < 0 && this.add < 0) {
                pos.x -= this.add;
            }
            if (box.w >= this.width) {
                this.add = -this.add;
            }
            this.end = box.w <= 1;
        }

    }
}