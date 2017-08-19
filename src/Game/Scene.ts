namespace Game {

    export class Scene {

        ictx: CanvasRenderingContext2D;
        sprite: Sprite;
        tick: number = 0;
        hero: Hero;
        ship: Ship;
        width: number = 256;
        cache: HTMLImageElement;
        enemies: Enemy[];
        platforms: Platform[];

        constructor(ictx: CanvasRenderingContext2D, img: HTMLImageElement) {
            this.ictx = ictx;
            this.sprite = new Sprite(img, this.width);
            this.hero = new Hero(96, 160, this.sprite.crop(ictx, 0, 0, 112, 48));
            this.ship = new Ship(160, 136, this.sprite.crop(ictx, 0, 88, 48, 48));
            this.platforms = [
                new Platform(-50, 0, 350, 16),
                new Platform(32, 72, 48, 8),
                new Platform(120, 96, 32, 8),
                new Platform(192, 48, 48, 8),
                new Platform(-50, 184, 350, 8),
            ];
            let sprite = this.sprite.crop(ictx, 0, 48, 48, 16),
                speed = new Vec(.5, -.5);
            this.enemies = [
                new Enemy(new Vec(0, 20), speed.clone(), sprite),
                new Enemy(new Vec(0, 60), speed.clone(), sprite),
                new Enemy(new Vec(0, 100), speed.clone(), sprite),
                new Enemy(new Vec(0, 140), speed.clone(), sprite),
            ]
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
                let box = this.platforms[i].box.clone(),
                    num = Math.round(box.w / 8) - 1;
                box.w = 8;
                this.sprite.render(ctx, box, 80, 0);
                for (let j = 1; j < num; j++) {
                    box.pos.x += box.w;
                    this.sprite.render(ctx, box, 80, 1);
                }
                box.pos.x += box.w;
                this.sprite.render(ctx, box, 80, 2);
            }
            this.cache = new Image();
            this.cache.src = ctx.canvas.toDataURL();
        }

        render(ctx: CanvasRenderingContext2D): void {
            this.back(ctx);
            this.ship.render(ctx);
            this.hero.render(ctx);
            this.hero.renderJet(ctx);
            this.enemies.forEach(enemy => {
                enemy.render(ctx);
            });
        }

        update(): void {
            let hero = this.hero;
            hero.update(this.tick);
            this.move(hero);
            for (let i = 0; i < this.enemies.length; i++) {
                let enemy = this.enemies[i];
                enemy.update(this.tick);
                this.move(enemy);
                if (this.collide(hero, enemy)) {
                    this.enemies.splice(i, 1);
                }
            }
            this.tick++;
        }

        collide(a: Item, b: Item): boolean {
            let ctx = this.ictx;
            if (a.box.test(b.box)) {
                let box = a.box.intersect(b.box),
                    x = Math.round(box.pos.x),
                    y = Math.round(box.pos.y),
                    w = box.w + 1,
                    h = box.h + 1;

                ctx.clearRect(x, y, w, h);
                a.render(ctx);
                let ad = ctx.getImageData(x, y, w, h);

                ctx.clearRect(x, y, w, h);
                b.render(ctx);
                let bd = ctx.getImageData(x, y, w, h);

                let length = ad.data.length,
                    resolution = 4 * 3;
                for (let j = 3; j < length; j += resolution) {
                    if (ad.data[j] && bd.data[j]) {
                        return true;
                    }
                }
            }
            return false;
        }

        move(item: Item) {
            let collided = item.collided,
                speed = item.speed,
                pos = item.box.pos,
                old = pos.clone(),
                walk = false;
            pos.x += speed.x;
            if (pos.x > this.width) {
                pos.x -= this.width;
            } else if (pos.x < 0) {
                pos.x += this.width;
            }
            collided.x = 0;
            this.platforms.forEach(platform => {
                if (platform.box.test(item.box)) {
                    pos.x = old.x;
                    collided.x = 1;
                }
            });
            pos.y += speed.y;
            collided.y = 0;
            this.platforms.forEach(platform => {
                if (platform.box.test(item.box)) {
                    pos.y = old.y;
                    collided.y = 1;
                    if (speed.y > 0) {
                        walk = true;
                    }
                }
            });
            item.walk = walk;
        }

    }

}