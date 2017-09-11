namespace Game {

    export interface SceneInterface {

        input(keys: object, down: boolean): void;
        render(ctx: CanvasRenderingContext2D): void;
        update(): void;
        complete(): boolean;
        stop(): void;

    }

    export class Scene implements SceneInterface {

        static sprite: Sprite;
        level: number;
        tick: number = 1;
        hero: Hero;
        ship: Ship;
        loot: Loot = null;
        width: number = 256;
        bumms: Bumm[] = [];
        planet: Planet;
        enemies: Spawner;

        constructor(level: number) {
            this.level = level;
        }

        stop() {
            this.hero.mute();
        }

        complete(): boolean {
            return this.ship.gone();
        }

        ai() {
            this.enemies.items.forEach(item => {
                if (item.collided.y) {
                    item.speed.y = -item.speed.y;
                }
                if (item.collided.x) {
                    item.speed.x = -item.speed.x;
                }                
            });
        }

        render(ctx: CanvasRenderingContext2D): void {
            this.planet.render(ctx);
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

        input(keys: object, down: boolean): void {
            const hero = this.hero;
            if (hero.inactive()){
                return;
            }
            hero.shoot = keys[0];
            hero.speed.y = keys[38] || keys[87] || keys[90] ? -1 : 1;
            if (keys[37] || keys[65] || keys[81]) {
                hero.speed.x = -1;
                hero.face = 0;
            } else if (keys[39] || keys[68]) {
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
                hero.mute();
                Ship.goSfx.play();
                Session.get().add(250);
                if (this.level % 4 == 3) {
                    Session.get().inc();
                }
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
                        ship.fuel = new Fuel(ship);
                    } else {
                        part.box.pos = prev.box.pos.clone().sub(0, part.box.h);
                    }
                    ship.status++;
                    Ship.buildSfx.play();
                    Session.get().add(25);
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
                this.addBumm(hero.box.pos.clone().add(hero.face ? -8 : 8, 12), 0, false);
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
                    this.addBumm(enemy.box.pos.clone());
                    Session.get().add(15);
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
                Session.get().add(125);
                this.loot = null;
            }
        }

        updateEnemies(): void {
            let hero = this.hero,
                enemies = this.enemies;
            enemies.items.forEach(item => {
                this.move(item);
            });
            this.ai();
            if (!hero.spawning() && !this.ship.go()) {
                enemies.items.forEach((enemy) => {
                    if (this.collide(hero, enemy)) {
                        this.addBumm(hero.box.pos.clone());
                        this.addBumm(hero.box.pos.clone().add(0, 8), 1, false);
                        Session.get().dec();
                        hero.spawn();
                    }
                });
            }
            enemies.update(this.tick);            
        }

        addBumm(pos: Vec, color: number = 1, sfx: boolean = true): void {
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
                if (ab.pos.x + ab.w >= width) {
                    ab.pos.x -= width;
                    retest = true;
                }
                if (bb.pos.x + bb.w >= width) {
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
            let platforms = this.planet.platforms,
                collided = item.collided,
                speed = item.speed,
                pos = item.box.pos,
                old = pos.clone();
            collided.x = 0;
            collided.y = 0;
            if (speed.x) {
                pos.x += speed.x;
                if (pos.x >= this.width) {
                    pos.x -= this.width;
                } else if (pos.x < 0) {
                    pos.x += this.width;
                }
                platforms.forEach(platform => {
                    if (platform.box.test(item.box)) {
                        pos.x = old.x;
                        collided.x = 1;
                    }
                });
            }
            if (speed.y) {
                pos.y += speed.y;
                platforms.forEach(platform => {
                    if (platform.box.test(item.box)) {
                        pos.y = old.y;
                        collided.y = 1;
                    }
                });
            }
        }

    }

    export class Scene0 extends Scene {

        constructor(level: number) {
            super(level);
            this.hero = new Hero(96, 160);
            this.ship = new Ship(level, new Vec(160, 136), new Vec(128, 80), new Vec(48, 56));
            this.planet = new Planet([
                new Platform(32, 72, 48, 1),
                new Platform(120, 96, 32, 1),
                new Platform(184, 48, 48, 1),
            ], [32,32,64,0], '#000', 200, ['#ccc'], 2);
            this.enemies = new Spawner(() => {
                return new Enemy(.5, Math.random() / 2 -.25, 0);
            }, level);
        }

        ai() {
            let i = 0,
                enemies = this.enemies.items;
            while (i < enemies.length) {
                let item = enemies[i];
                if (item.collided.x || item.collided.y) {
                    this.addBumm(item.box.pos);
                    enemies.splice(i, 1);
                } else {
                    i++;
                }
            }
        }
    }

    export class Scene1 extends Scene {

        constructor(level: number) {
            super(level);
            this.hero = new Hero(96, 160);
            this.ship = new Ship(level, new Vec(136, -120));
            this.planet = new Planet([
                new Platform(48, 96, 64, 3),
                new Platform(200, 48, 32, 3),
                new Platform(184, 112, 56, 3),
            ], [128, 64, 0, .5], '#500', 0, ['#cfc', '#ccf']);
            this.enemies = new Spawner(() => {
                return new Enemy(.5, Math.random() < .5 ? -.5 : .5, 7);
            }, level);
        }
    }

    export class Scene2 extends Scene {

        constructor(level: number) {
            super(level);
            this.hero = new Hero(160, 160);
            this.ship = new Ship(level, new Vec(96, -120));
            this.planet = new Planet([
                new Platform(32, 48, 48, 4),
                new Platform(120, 64, 32, 4),
                new Platform(192, 96, 48, 4),
            ], [40,40,40,0], '#555', 200, ['#06c']);
            this.enemies = new Spawner(() => {
                return new Enemy(.5, 0, 6);
            }, level);
        }

        ai() {
            super.ai();
            this.enemies.items.forEach((item: Enemy) => {
                if (item.tick % 64 == 0) {
                    item.speed.y = (Math.round(Math.random() * 2) - 1) / 2;
                }
            });
        }
    }
    
    export class Scene3 extends Scene {

        constructor(level: number) {
            super(level);
            this.hero = new Hero(96, 160);
            this.ship = new Ship(level, new Vec(160, -120));
            this.planet = new Planet([
                new Platform(32, 96, 32, 0),
                new Platform(96, 48, 48, 0),
                new Platform(184, 80, 48, 0),
            ], [128, 128, 255, .5], '#ccc', 200, []);
            this.enemies = new Spawner(() => {
                return new Enemy(0, 0, 1);
            }, level);
        }

        ai() {
            let i = 0,
                hero = this.hero,
                enemies = this.enemies.items;
            while (i < enemies.length) {
                let item: Enemy = <Enemy>enemies[i];
                if (item.tick % 80 == 0 && item.speed.x == 0) {
                    item.speed = hero.box.pos.clone().sub(item.box.pos).normalize();
                }
                if (item.collided.x) {
                    this.addBumm(item.box.pos);
                    enemies.splice(i, 1);
                } else {
                    if (item.collided.y) {
                        item.speed.y = -item.speed.y;
                    } 
                    i++;
                }
            }
        }
    }
    
    export class Scene4 extends Scene {
        
        constructor(level: number) {
            super(level);
            this.hero = new Hero(160, 160);
            this.ship = new Ship(level, new Vec(120, 136), new Vec(212, 80), new Vec(48, 64));
            this.planet = new Planet([
                new Platform(32, 80, 56, 1),
                new Platform(152, 56, 32, 1),
                new Platform(204, 96, 32, 1),
            ], [40,160,160,.5], '#060', 0, ['#fff']);
            this.enemies = new Spawner(() => {
                return new Enemy(.5, -.5, 4);
            }, level);
        }

        ai() {
            this.enemies.items.forEach((item: Enemy) => {
                let hero = this.hero;
                if (item.tick % 80 == 0 && !hero.inactive()) {
                    item.speed = hero.box.pos.clone().sub(item.box.pos).normalize().scale(.7);
                }
            });
        }
    }

    export class Scene5 extends Scene {

        constructor(level: number) {
            super(level);
            this.hero = new Hero(160, 160);
            this.ship = new Ship(level, new Vec(96, -120));
            this.planet = new Planet([
                new Platform(32, 48, 48, 2),
                new Platform(120, 96, 32, 2),
                new Platform(192, 72, 48, 2),
            ], [240,160,40,.5], '#960', 0, ['#f90']);
            this.enemies = new Spawner(() => {
                return new Enemy(.5, Math.random() < .5 ? -.7 : .7, 5);
            }, level);
        }
    }

    
    export class Scene6 extends Scene0 {
        
        constructor(level: number) {
            super(level);
            this.hero = new Hero(80, 160);
            this.ship = new Ship(level, new Vec(135, -120));
            this.planet = new Planet([
                new Platform(32, 56, 32, 5),
                new Platform(56, 104, 48, 5),
                new Platform(176, 72, 56, 5),
            ], [40,80,40,0], '#000', 200, ['#666', '#999', '#ccc']);
            this.enemies = new Spawner(() => {
                return new Enemy(.7, Math.random() / 2 -.25, 2);
            }, level);
        }
    }

    export class Scene7 extends Scene4 {

        constructor(level: number) {
            super(level);
            this.hero = new Hero(144, 160);
            this.ship = new Ship(level, new Vec(80, -120));
            this.planet = new Planet([
                new Platform(32, 96, 32, 6),
                new Platform(104, 80, 48, 6),
                new Platform(192, 48, 48, 6),
            ], [40,200,200,0], '#000', 200, []);
            this.enemies = new Spawner(() => {
                return new Enemy(.5, -.5, 3);
            }, level);
        }

    }
}