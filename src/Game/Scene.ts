namespace Game {

    export class Scene {

        static sprite: Sprite;
        tick: number = 1;
        hero: Hero;
        ship: Ship;
        loot: Loot = null;
        width: number = 256;
        bumms: Bumm[] = [];
        cache: HTMLImageElement;
        enemies: Spawner;
        platforms: Platform[];

        constructor() {
            this.hero = new Hero(96, 160);
            //this.ship = new Ship(0, new Vec(160, -120));
            this.ship = new Ship(0, new Vec(160, 136), new Vec(128, 80), new Vec(48, 56));
            //this.ship.status = 9;
            this.enemies = new Spawner(64, 4, (index: number) => {
                return new Enemy(
                    new Vec(0, Math.round(Math.random() * 136) + 32),
                    new Vec(.5, Math.random() > .5 ? .5 : -.5),
                    Math.round(index % 4) + 1
                );
            });
            this.platforms = [
                new Platform(-50, 8, 350, -1),
                new Platform(32, 72, 48, 1),
                new Platform(120, 96, 32, 1),
                new Platform(192, 48, 48, 1),
                new Platform(-50, 184, 350, 2),
            ];
        }

        complete(): boolean {
            return this.ship.gone();
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
            new Txt(new Vec(0, 0), 'Player 1').render(ctx);
            new Txt(new Vec(0, 8), '00000000', 1).render(ctx);
            new Txt(new Vec(104, 0), 'Hi Score', 2).render(ctx);
            new Txt(new Vec(104, 8), '00000000', 1).render(ctx);
            new Txt(new Vec(207, 0), 'Player 2').render(ctx);
            new Txt(new Vec(207, 8), '00000000', 1).render(ctx);
            this.cache = new Image();
            this.cache.src = ctx.canvas.toDataURL();
        }

        render(ctx: CanvasRenderingContext2D): void {
            this.back(ctx);
            this.ship.render(ctx);
            if (this.loot) {
                this.loot.render(ctx);
            }
            if (!this.ship.go()) {
                this.hero.render(ctx);
            }
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
            this.updateLoot();
            this.updateEnemies();
            this.updateBumms();
            this.tick++;
        }

        updateShip(): void {
            let ship = this.ship,
                hero = this.hero;
            ship.update(this.tick);
            if (ship.ready() && ship.box.contains(hero.box)) {
                ship.status++;
                Ship.goSfx.play();
                hero.mute();
            }
            if (ship.go() || !ship.land()) {
                return;
            }
            let complete = ship.complete(),
                prev = ship.parts[complete ? 0 : ship.status - 1],
                part = complete ? ship.fuel : ship.parts[ship.status],
                diff = Math.abs(prev.box.pos.x - part.box.pos.x);
            this.move(part);
            if (diff < 1) {
                hero.pick = false;
                part.box.pos.x = prev.box.pos.x;
                if (part.box.test(prev.box)) {
                    if (complete) {
                        ship.fuel = new Fuel();
                    } else {
                        part.box.pos = prev.box.pos.clone().sub(0, part.box.h);
                    }
                    ship.status++;
                    Ship.buildSfx.play();
                }
            } else if (!hero.inactive() && !ship.ready()) {
                let box = hero.box.clone(),
                    pos = part.box.pos,
                    width = this.width,
                    collide = box.test(part.box);
                if (!collide) {
                    box.pos.x -= width;
                    collide = box.test(part.box);
                }
                if (!collide) {
                    box.pos.x += width * 2;
                    collide = box.test(part.box);
                }
                if (collide) {
                    if (!hero.pick) {
                        Hero.pickSfx.play();
                        hero.pick = true;
                    }
                    pos.add(box.pos.add(0, 8).sub(pos).scale(.2));
                    if (pos.x < 0) {
                        pos.x += width;
                    } else if (pos.x > width) {
                        pos.x -= width;
                    }
                }
            }
        }

        updateHero(): void {
            let hero = this.hero,
                ship = this.ship;
            if (!ship.land() || ship.go()) {
                return;
            }
            this.move(hero);
            let walk = hero.collided.y && hero.speed.y > 0;
            if (hero.walk && !walk) {
                this.addBumm(hero.box.pos.clone().add(hero.face ? -8 : 8, 12));
            }
            hero.walk = walk;

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

        updateLoot(): void {
            if (this.loot === null) {
                if (this.tick % 1000 == 0) {
                    this.loot = new Loot();
                }
                return;
            }
            let loot = this.loot;
            this.move(loot);
            loot.update(this.tick);
            if (!this.ship.go() && this.collide(loot, this.hero)) {
                Loot.sfx.play();
                this.loot = null;
            }
        }

        updateEnemies(): void {
            let hero = this.hero,
                enemies = this.enemies;
            enemies.items.forEach(item => {
                this.move(item);
            });
            if (!hero.spawning() && !this.ship.go()) {
                enemies.items.forEach((enemy) => {
                    if (this.collide(hero, enemy)) {
                        this.addBumm(hero.box.pos.clone(), 1, true);
                        this.addBumm(hero.box.pos.clone().add(0, 8), 1);
                        hero.spawn();
                    }
                });
            }
            enemies.update(this.tick);            
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
            let ctx = Scene.sprite.ictx,
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
                x = box.pos.x,
                y = box.pos.y,
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