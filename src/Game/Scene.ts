namespace Game {

    export class Scene implements Item {

        hero: Hero;

        platforms: Platform[];

        constructor() {
            this.hero = new Hero(128, 72);
            this.platforms = [
                new Platform(32, 72, 48, 8),
                new Platform(120, 96, 32, 8),
                new Platform(192, 48, 48, 8),
                new Platform(0, 184, 256, 8)
            ];
        }

        render(ctx: CanvasRenderingContext2D): void {
            this.hero.render(ctx);
            this.platforms.forEach(platform => {
                platform.render(ctx);
            });
        }

        update(): void {
            let hero = this.hero,
                speed = hero.speed,
                pos = hero.box.pos;
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