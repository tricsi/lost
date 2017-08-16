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
                res = new SAT.Response();
            hero.update();
            this.platforms.forEach(platform => {
                let collided = SAT.testPolygonPolygon(platform.collider.toPolygon(), hero.collider.toPolygon(), res);
                if (collided) {
                    hero.pos.add(res.overlapV);
                }
            });
        }

    }

}