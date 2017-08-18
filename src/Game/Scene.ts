namespace Game {

    export class Scene {

        sprite: Sprite;
        tick: number = 0;
        hero: Hero;
        ship: Ship;
        width: number = 256;
        cache: HTMLImageElement;
        platforms: Platform[];

        constructor(img: HTMLImageElement) {
            this.sprite = new Sprite(img);
            this.hero = new Hero(96, 160, this.sprite);
            this.ship = new Ship(160, 136, this.sprite);
            console.log(this.ship);
            this.platforms = [
                new Platform(-50, 0, 350, 16),
                new Platform(32, 72, 48, 8),
                new Platform(120, 96, 32, 8),
                new Platform(192, 48, 48, 8),
                new Platform(-50, 184, 350, 8),
            ];
        }

        back(ctx: CanvasRenderingContext2D): void {
            if (this.cache) {
                ctx.drawImage(this.cache, 0, 0);
                return;
            }
            let sky = ctx.createLinearGradient(0, 0, 0, 192);
            sky.addColorStop(0, "#002");
            sky.addColorStop(1, "#224");
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            for (let i = 1; i < this.platforms.length; i++) {
                let box = this.platforms[i].box,
                    x = box.pos.x,
                    y = box.pos.y,
                    j = 8;
                this.sprite.render(ctx, x, y, j, 8, 80, 0);
                for (; j < box.w - 8; j += 8) {
                    this.sprite.render(ctx, x + j, y, 8, 8, 80, 1);
                }
                this.sprite.render(ctx, x + j, y, 8, 8, 80, 2);
            }
            this.cache = new Image();
            this.cache.src = ctx.canvas.toDataURL();
        }

        render(ctx: CanvasRenderingContext2D): void {
            this.back(ctx);
            this.ship.render(ctx);
            this.hero.render(ctx, this.width);
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