namespace Game {

    export class Scene implements Item {

        sprite: Sprite;
        tick: number = 0;
        hero: Hero;
        platforms: Platform[];

        constructor() {
            this.hero = new Hero(128, 72);
            this.sprite = new Sprite('sprite.png');
            this.platforms = [
                new Platform(0, 0, 256, 16),
                new Platform(32, 72, 48, 8),
                new Platform(120, 96, 32, 8),
                new Platform(192, 48, 48, 8),
                new Platform(0, 184, 256, 8)
            ];
        }

        render(ctx: CanvasRenderingContext2D): void {
            ctx.fillStyle = "#333";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.hero.render(ctx, this.sprite);
            this.platforms.forEach(platform => {
                platform.render(ctx, this.sprite);
            });
        }

        update(): void {
            let hero = this.hero,
                speed = hero.speed,
                pos = hero.box.pos;
            hero.update(this.tick++);
            pos.x += speed.x;
            this.platforms.forEach(platform => {
                if (platform.box.test(hero.box)) {
                    pos.x -= speed.x;
                }
            });
            pos.y += speed.y;
            this.platforms.forEach(platform => {
                if (platform.box.test(hero.box)) {
                    pos.y -= speed.y;
                }
            });
        }

    }

}