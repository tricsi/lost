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
            this.ship = new Ship(new Vec(160, 136), new Vec(128, 80), new Vec(48, 56));
            this.enemies = new Enemies(64, 4, (index: number) => {
                return new Enemy(
                    new Vec(0, Math.round(Math.random() * 136) + 32),
                    new Vec(.5, Math.random() > .5 ? .5 : -.5),
                    Math.round(index % 4) + 1
                );
            });
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
            this.enemies.render(ctx);
            this.bumms.forEach(bumm => {
                bumm.render(ctx);
            });
        }

        input(keys: object, e: KeyboardEvent): void {
            const hero = this.hero;
            if (hero.inactive()){
                return;
            }
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
            this.updateHero();
            this.updateShip();
            this.updateEnemies();
            this.updateBumms();
            this.tick++;
        }

        updateShip(): void {
            let ship = this.ship;
            if (ship.status < ship.parts.length) {
                let hero = this.hero,
                    prev = ship.parts[ship.status - 1],
                    part = ship.parts[ship.status],
                    diff = Math.abs(prev.box.pos.x - part.box.pos.x);
                this.move(part);
                if (diff < 1) {
                    part.box.pos.x = prev.box.pos.x;
                    if (part.box.test(prev.box)) {
                        part.box.pos = prev.box.pos.clone().sub(0, part.box.h);
                        ship.status++;
                    }
                } else if (!hero.inactive() && part.box.test(hero.box)) {
                    part.box.pos.add(hero.box.pos.clone().add(0, 8).sub(part.box.pos).scale(.2));
                }
            }
        }

        updateHero(): void {
            const hero = this.hero;

            this.move(hero);
            let walk = hero.collided.y && hero.speed.y > 0;
            if (hero.walk && !walk) {
                this.addBumm(hero.box.pos.clone().add(hero.face ? -8 : 8, 12));
            }
            hero.walk = walk;

            if (!hero.spawning()) {
                this.enemies.items.forEach((enemy) => {
                    if (this.collide(hero, enemy)) {
                        this.addBumm(hero.box.pos.clone(), 1, true);
                        this.addBumm(hero.box.pos.clone().add(0, 8), 1);
                        hero.spawn();
                    }
                });
            }
            
            this.hero.update(this.tick);
            let i = 0;
            while (i < hero.lasers.length) {
                let laser = hero.lasers[i];
                this.updateLaser(laser);
                if (laser.end) {
                    hero.lasers.splice(i, 1);
                } else {
                    i++;
                }
            }
        }

        updateLaser(laser: Laser): void {
            let box = laser.box,
                pos = box.pos;

            pos.x += laser.speed.x;
            if (pos.x > this.width) {
                pos.x -= this.width;
            } else if (pos.x < 0) {
                pos.x += this.width;
            }

            laser.update(this.tick);
            if (laser.end) {
                return;
            }
            
            let i = 0,
                items = this.enemies.items;
            while (i < items.length) {
                let enemy = items[i];
                if (this.collide(laser, enemy)) {
                    items.splice(i, 1);
                    this.addBumm(enemy.box.pos.clone(), 1, true);
                } else {
                    i++;
                }
            }
        }

        updateEnemies(): void {
            this.enemies.items.forEach(enemy => {
                this.move(enemy);
            });
            this.enemies.update(this.tick);
        }

        addBumm(pos: Vec, color: number = 0, sfx: boolean = false): void {
            this.bumms.push(new Bumm(pos, color, sfx));
        }

        updateBumms(): void {
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
            collided.x = 0;
            collided.y = 0;
            if (speed.x) {
                pos.x += speed.x;
                if (pos.x > this.width) {
                    pos.x -= this.width;
                } else if (pos.x < 0) {
                    pos.x += this.width;
                }
                this.platforms.forEach(platform => {
                    if (platform.box.test(item.box)) {
                        pos.x = old.x;
                        collided.x = 1;
                    }
                });
            }
            if (speed.y) {
                pos.y += speed.y;
                this.platforms.forEach(platform => {
                    if (platform.box.test(item.box)) {
                        pos.y = old.y;
                        collided.y = 1;
                    }
                });
            }
        }

    }

}