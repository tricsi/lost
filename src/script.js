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
        constructor(x, y) {
            this.face = 0;
            this.walk = true;
            this.frame = 0;
            this.speed = new Game.Vec(0, 1);
            this.box = new Game.Box(new Game.Vec(x, y), 16, 24);
        }
        render(ctx, sprite, width) {
            let box = this.box, pos = box.pos;
            let frame = this.frame;
            if (this.walk) {
                frame = this.speed.x == 0 ? 3 : frame + 3;
            }
            sprite.render(ctx, pos.x, pos.y, box.w, box.h, this.face * box.h, frame);
            if (pos.x + box.w > width) {
                sprite.render(ctx, pos.x - width, pos.y, box.w, box.h, this.face * box.h, frame);
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
        constructor() {
            this.tick = 0;
            this.width = 256;
            this.hero = new Game.Hero(96, 160);
            this.sprite = new Game.Sprite('sprite.png');
            this.platforms = [
                new Game.Platform(-50, 0, 350, 16),
                new Game.Platform(32, 72, 48, 8),
                new Game.Platform(120, 96, 32, 8),
                new Game.Platform(192, 48, 48, 8),
                new Game.Platform(-50, 184, 350, 8)
            ];
        }
        render(ctx) {
            ctx.fillStyle = "#224";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.hero.render(ctx, this.sprite, this.width);
            this.platforms.forEach(platform => {
                platform.render(ctx, this.sprite);
            });
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
    class Sprite {
        constructor(src) {
            this.img = new Image();
            this.img.src = src;
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
    function render() {
        scene.render(ctx);
    }
    function update() {
        requestAnimationFrame(() => {
            update();
        });
        scene.update();
        render();
    }
    function run(id) {
        canvas = $(id);
        ctx = canvas.getContext('2d');
        scene = new Game.Scene();
        bind();
        update();
    }
    Game.run = run;
})(Game || (Game = {}));
Game.run('#game');
//# sourceMappingURL=script.js.map