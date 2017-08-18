var Game;
(function (Game) {
    class Box {
        constructor(pos, w, h) {
            this.pos = pos;
            this.w = w;
            this.h = h;
        }
        test(box) {
            return this.pos.x < box.pos.x + box.w &&
                this.pos.x + this.w > box.pos.x &&
                this.pos.y < box.pos.y + box.h &&
                this.h + this.pos.y > box.pos.y;
        }
        intersect(box) {
            let Ax = this.pos.x, Ay = this.pos.y, AX = Ax + this.w, AY = Ay + this.h, Bx = box.pos.x, By = box.pos.y, BX = Bx + box.w, BY = By + box.h, Cx = Ax < Bx ? Bx : Ax, Cy = Ay < By ? By : Ay, CX = AX < BX ? AX : BX, CY = AY < BY ? AY : BY;
            return new Box(new Game.Vec(Cx, Cy), CX - Cx, CY - Cy);
        }
    }
    Game.Box = Box;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Hero {
        constructor(x, y, sprite) {
            this.face = 0;
            this.walk = true;
            this.frame = 0;
            this.sprite = sprite;
            this.speed = new Game.Vec(0, 1);
            this.box = new Game.Box(new Game.Vec(x, y), 16, 24);
        }
        render(ctx, width) {
            let box = this.box, pos = box.pos, x = pos.x, y = pos.y, w = box.w, h = box.h, top = this.face * h, walk = this.walk, frame = this.frame, sprite = this.sprite;
            if (walk) {
                frame = this.speed.x != 0 ? frame : 0;
                sprite.render(ctx, x, y, w, h, top, frame + 1);
            }
            else {
                sprite.render(ctx, x, y, w, h, top, 0);
                sprite.render(ctx, x, y, w, h, top, frame + 4);
            }
            if (pos.x + box.w > width) {
                x -= width;
                if (walk) {
                    sprite.render(ctx, x, y, w, h, top, frame + 1);
                }
                else {
                    sprite.render(ctx, x, y, w, h, top, 0);
                    sprite.render(ctx, x, y, w, h, top, frame + 4);
                }
            }
        }
        update(tick) {
            if (tick % 8 == 0) {
                this.frame = ++this.frame % 3;
            }
        }
    }
    Game.Hero = Hero;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Platform {
        constructor(x, y, width, height) {
            this.box = new Game.Box(new Game.Vec(x, y), width, height);
        }
        render(ctx, sprite) {
            const box = this.box;
            ctx.fillStyle = '#0ff';
            ctx.fillRect(box.pos.x, box.pos.y, box.w, box.h);
        }
    }
    Game.Platform = Platform;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Scene {
        constructor(img) {
            this.tick = 0;
            this.width = 256;
            this.sprite = new Game.Sprite(img);
            this.hero = new Game.Hero(96, 160, this.sprite);
            this.ship = new Game.Ship(160, 136, this.sprite);
            console.log(this.ship);
            this.platforms = [
                new Game.Platform(-50, 0, 350, 16),
                new Game.Platform(32, 72, 48, 8),
                new Game.Platform(120, 96, 32, 8),
                new Game.Platform(192, 48, 48, 8),
                new Game.Platform(-50, 184, 350, 8),
            ];
        }
        back(ctx) {
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
                let box = this.platforms[i].box, x = box.pos.x, y = box.pos.y, j = 8;
                this.sprite.render(ctx, x, y, j, 8, 80, 0);
                for (; j < box.w - 8; j += 8) {
                    this.sprite.render(ctx, x + j, y, 8, 8, 80, 1);
                }
                this.sprite.render(ctx, x + j, y, 8, 8, 80, 2);
            }
            this.cache = new Image();
            this.cache.src = ctx.canvas.toDataURL();
        }
        render(ctx) {
            this.back(ctx);
            this.ship.render(ctx);
            this.hero.render(ctx, this.width);
        }
        update() {
            let hero = this.hero, speed = hero.speed, pos = hero.box.pos, old = pos.clone();
            hero.walk = false;
            hero.update(this.tick++);
            pos.x += speed.x;
            if (pos.x > this.width) {
                pos.x -= this.width;
            }
            else if (pos.x < 0) {
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
    Game.Scene = Scene;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Ship {
        constructor(x, y, sprite) {
            this.sprite = sprite;
            this.boxes = [
                new Game.Box(new Game.Vec(x, y), 16, 16),
                new Game.Box(new Game.Vec(x, y + 16), 16, 16),
                new Game.Box(new Game.Vec(x, y + 32), 16, 16),
            ];
        }
        render(ctx) {
            this.boxes.forEach((box, i) => {
                let pos = box.pos, top = box.h * i + 88;
                this.sprite.render(ctx, pos.x, pos.y, box.w, box.h, top, 0);
            });
        }
    }
    Game.Ship = Ship;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Sprite {
        constructor(img) {
            this.img = img;
        }
        render(ctx, x, y, w, h, top, frame) {
            ctx.drawImage(this.img, w * frame, top, w, h, x, y, w, h);
        }
    }
    Game.Sprite = Sprite;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Vec {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        clone() {
            return new Vec(this.x, this.y);
        }
    }
    Game.Vec = Vec;
})(Game || (Game = {}));
var Game;
(function (Game) {
    function $(query, element) {
        return (element || document).querySelector(query);
    }
    function on(element, event, callback) {
        element.addEventListener(event, callback, false);
    }
    let canvas, ctx, scene;
    function bind() {
        const hero = scene.hero;
        on(document, 'keydown', (e) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119) {
                hero.speed.y = -1;
            }
            else if (key == 37 || key == 65 || key == 97) {
                hero.speed.x = -1;
                hero.face = 0;
            }
            else if (key == 39 || key == 68 || key == 100) {
                hero.speed.x = 1;
                hero.face = 1;
            }
        });
        on(document, 'keyup', (e) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119 || key == 40 || key == 83 || key == 115) {
                hero.speed.y = 1;
            }
            else if (key == 37 || key == 65 || key == 97 || key == 39 || key == 68 || key == 100) {
                hero.speed.x = 0;
            }
        });
    }
    function update() {
        requestAnimationFrame(() => {
            update();
        });
        scene.update();
        scene.render(ctx);
    }
    on(window, 'load', () => {
        const img = $('#sprite');
        canvas = $('#game');
        ctx = canvas.getContext('2d');
        scene = new Game.Scene(img);
        bind();
        update();
    });
})(Game || (Game = {}));
//# sourceMappingURL=script.js.map