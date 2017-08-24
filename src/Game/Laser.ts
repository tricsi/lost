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

        update(scene: Scene): void {
            let box = this.box,
                pos = box.pos,
                add = --this.tick < 0 ? -this.add : this.add;

            pos.x += this.speed.x;
            if (pos.x > scene.width) {
                pos.x -= scene.width;
            } else if (pos.x < 0) {
                pos.x += scene.width;
            }

            box.w += add;
            if (this.face) {
                pos.x -= add;
            }
            this.end = box.w <= this.add;

            let i = 0,
                items = scene.enemies.items;
            while (!this.end && i < items.length) {
                let enemy = items[i];
                if (scene.collide(this, enemy)) {
                    items.splice(i, 1);
                    scene.addBumm(enemy.box.pos.clone(), 1, true);
                } else {
                    i++;
                }
            }
        }

    }
}