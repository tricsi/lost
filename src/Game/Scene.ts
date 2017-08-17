namespace Game {

    export class Scene {

        sprite: Sprite;
        tick: number = 0;
        hero: Hero;
        width: number = 256;
        platforms: Platform[];

        constructor() {
            this.hero = new Hero(96, 160);
            this.sprite = new Sprite('sprite.png');
            this.platforms = [
                new Platform(-50, 0, 350, 16),
                new Platform(32, 72, 48, 8),
                new Platform(120, 96, 32, 8),
                new Platform(192, 48, 48, 8),
                new Platform(-50, 184, 350, 8)
            ];
        }

        render(ctx: CanvasRenderingContext2D): void {
            ctx.fillStyle = "#224";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.hero.render(ctx, this.sprite, this.width);
            this.platforms.forEach(platform => {
                platform.render(ctx, this.sprite);
            });
        }

        update(): void {
            let hero = this.hero,
                speed = hero.speed,
                pos = hero.box.pos,
                old = pos.clone();
            hero.walk = false;
            hero.update(this.tick++);
            pos.x += speed.x;
            if (pos.x > this.width) {
                pos.x -= this.width;
            } else if (pos.x < 0) {
                pos.x += this.width;
            }
            this.platforms.forEach(platform => {
                if (platform.box.test(hero.box)) {
                    pos.x = old.x;
                }
            });
            pos.y += speed.y;
            this.platforms.forEach(platform => {
                if (platform.box.test(hero.box)) {
                    pos.y = old.y;
                    hero.walk = speed.y > 0;
                }
            });
        }

    }

}