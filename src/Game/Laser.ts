namespace Game {

    export class Laser implements Item {

        static sprite: Sprite;
        collided: Vec;
        speed: Vec;
        box: Box;
        end: false;

        constructor(hero: Hero) {
            let box = hero.box.clone(),
                pos = box.pos,
                speed = new Vec(-1, 0);
            if (hero.face) {
                speed.x = 1;
                pos.x += box.w;
            } else {
                pos.x -= 112;
            }
            pos.y += 12;
            box.h = 1;
            box.w = 112;
            this.box = box;
            this.speed = speed;
        }

        render(ctx: CanvasRenderingContext2D): void {
            Laser.sprite.render(ctx, this.box, 0, 0);
        }

        update(tick: number): void {
        }

    }
}