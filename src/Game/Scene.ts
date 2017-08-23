namespace Game {

    export class Scene {

        sprite: Sprite;
        tick: number = 0;
        hero: Hero;
        ship: Ship;
        width: number = 256;
        bumms: Bumm[] = [];
        cache: HTMLImageElement;
        enemies: Enemy[];
        platforms: Platform[];
        jetSound: AudioBufferSourceNode = null;

        constructor(sprite: Sprite) {
            this.sprite = sprite;
            this.hero = new Hero(96, 160);
            this.ship = new Ship(160, 136);
            this.initPlatforms();
            this.initEnemies();
            this.hero.shot();
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

        initEnemies(): void {
            const speed = new Vec(.5, -.5);
            this.enemies = [];
            for (let i = 0; i < 4; i++) {
                let enemy = new Enemy(new Vec(0, i * 40 + 20), speed.clone(), i + 1);
                this.enemies.push(enemy);
            }
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
            this.enemies.forEach(enemy => {
                enemy.render(ctx);
            });
            this.bumms.forEach(bumm => {
                bumm.render(ctx);
            });
        }

        update(): void {
            let hero = this.hero;
            this.move(hero);
            hero.update(this.tick);
            if (hero.walk && this.jetSound) {
                this.jetSound.stop();
                this.jetSound = null;
            }
            if (!hero.walk && !this.jetSound) {
                this.jetSound = Hero.jetSfx.play(.5, true);
            }
            let i = 0;
            while (i < this.enemies.length) {
                let enemy = this.enemies[i];
                enemy.update(this.tick);
                this.move(enemy);
                if (this.collide(hero, enemy)) {
                    this.enemies.splice(i, 1);
                    this.bumms.push(new Bumm(enemy.box.pos.clone()));
                    Bumm.sfx.play();
                } else {
                    i++;
                }
            }
            i = 0;
            while (i < this.bumms.length) {
                let bumm = this.bumms[i];
                bumm.update(this.tick);
                if (bumm.end) {
                    this.bumms.splice(i, 1);
                } else {
                    i++;
                }
            }
            this.tick++;
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