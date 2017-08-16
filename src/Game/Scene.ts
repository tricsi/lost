namespace Game {

    export class Scene implements Item {

        hero: Hero;

        platforms: Platform[];

        constructor() {
            this.hero = new Hero(80, 60);
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
                res = new SAT.Response(),
                pos = hero.collider.pos,
                sign = hero.speed.sign();
            pos.add(hero.speed);
            for (let i = 0; i < this.platforms.length; i++) {
                while (this.platforms[i].collider.test(hero.collider)) {
                    pos.sub(sign);
                }
            };
        }

    }

}