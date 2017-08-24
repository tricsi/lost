namespace Game {

    export class Scene {

        sprite: Sprite;
        tick: number = 0;
        hero: Hero;
        ship: Ship;
        width: number = 256;
        bumms: Bumm[] = [];
        cache: HTMLImageElement;
        enemies: Enemies;
        platforms: Platform[];

        constructor(sprite: Sprite) {
            this.sprite = sprite;
            this.hero = new Hero(96, 160);
            this.ship = new Ship(160, 136);
            this.enemies = new Enemies(64, 4, (index: number) => {
                return new Enemy(
                    new Vec(0, Math.round(Math.random() * 136) + 32),
                    new Vec(.5, Math.random() > .5 ? .5 : -.5),
                    Math.round(index % 4) + 1
                );
            });
            this.initPlatforms();
        }

        ready() {
            return Sprite.load == Sprite.loaded;
        }

        initPlatforms(): void {
            this.platforms = [
                new Platform(-50, 0, 350, -1),
                new Platform(32, 72, 48, 1),
                new Platform(120, 96, 32, 1),
                new Platform(192, 48, 48, 1),
                new Platform(-50, 184, 350, 2),
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
            this.platforms.forEach(platform => {
                platform.render(ctx);
            });
            this.cache = new Image();
            this.cache.src = ctx.canvas.toDataURL();
        }

        render(ctx: CanvasRenderingContext2D): void {
            this.back(ctx);
            this.ship.render(ctx);
            this.hero.render(ctx);
            this.hero.renderJet(ctx);
            this.enemies.render(ctx);
            this.bumms.forEach(bumm => {
                bumm.render(ctx);
            });
        }

        input(keys: object, e: KeyboardEvent): void {
            const hero = this.hero;
            hero.shoot = e.shiftKey;
            hero.speed.y = keys[38] || keys[87] || keys[119] ? -1 : 1;
            if (keys[37] || keys[65] || keys[97]) {
                hero.speed.x = -1;
                hero.face = 0;
            } else if (keys[39] || keys[68] || keys[100]) {
                hero.speed.x = 1;
                hero.face = 1;
            } else {
                hero.speed.x = 0;
            }

        }

        update(): void {
            this.hero.update(this);
            this.enemies.update(this);
            this.updateBumms();
            this.tick++;
        }

        addBumm(pos: Vec, color: number = 0, sfx: boolean = false) {
            this.bumms.push(new Bumm(pos, color, sfx));
        }

        updateBumms() {
            let i = 0;
            while (i < this.bumms.length) {
                let bumm = this.bumms[i];
                bumm.update(this);
                if (bumm.end) {
                    this.bumms.splice(i, 1);
                } else {
                    i++;
                }
            }
        }

        collide(a: Item, b: Item): boolean {
            let ctx = this.sprite.ictx,
                width = this.width,
                ab = a.box.clone(),
                bb = b.box.clone(),
                retest = false;
            if (!ab.test(bb)) {
                if (ab.pos.x + ab.w > width) {
                    ab.pos.x -= width;
                    retest = true;
                }
                if (bb.pos.x + bb.w > width) {
                    bb.pos.x -= width;
                    retest = true;
                }
                if (!retest || !ab.test(bb)) {
                    return false;
                }
            }
            let box = ab.intersect(bb),
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
                resolution = 4 * 5;
            for (let j = 3; j < length; j += resolution) {
                if (ad.data[j] && bd.data[j]) {
                    return true;
                }
            }
            return false;
        }

        move(item: Item) {
            let collided = item.collided,
                speed = item.speed,
                pos = item.box.pos,
                old = pos.clone();
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
                }
            });
        }

    }

}