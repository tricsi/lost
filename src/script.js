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
            this.speed = new Game.Vec(0, 1);
            this.box = new Game.Box(new Game.Vec(x, y), 16, 24);
        }
        render(ctx) {
            const box = this.box;
            ctx.fillStyle = '#f0f';
            ctx.fillRect(box.pos.x, box.pos.y, box.w, box.h);
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
        render(ctx) {
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
            this.hero = new Game.Hero(128, 72);
            this.platforms = [
                new Game.Platform(32, 72, 48, 8),
                new Game.Platform(120, 96, 32, 8),
                new Game.Platform(192, 48, 48, 8),
                new Game.Platform(0, 184, 256, 8)
            ];
        }
        render(ctx) {
            this.hero.render(ctx);
            this.platforms.forEach(platform => {
                platform.render(ctx);
            });
        }
        update() {
            let hero = this.hero, speed = hero.speed, pos = hero.box.pos;
            pos.x += speed.x;
            this.platforms.forEach(platform => {
                if (platform.box.test(hero.box)) {
                    pos.x -= speed.x;
                }
            });
            pos.y += speed.y;
            this.platforms.forEach(platform => {
                if (platform.box.test(hero.box)) {
                    pos.y -= speed.y;
                }
            });
        }
    }
    Game.Scene = Scene;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Vec {
        constructor(x, y) {
            this.x = x;
            this.y = y;
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
        const speed = scene.hero.speed;
        on(document, 'keydown', (e) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119) {
                speed.y = -1;
            }
            else if (key == 37 || key == 65 || key == 97) {
                speed.x = -1;
            }
            else if (key == 39 || key == 68 || key == 100) {
                speed.x = 1;
            }
        });
        on(document, 'keyup', (e) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119 || key == 40 || key == 83 || key == 115) {
                speed.y = 1;
            }
            else if (key == 37 || key == 65 || key == 97 || key == 39 || key == 68 || key == 100) {
                speed.x = 0;
            }
        });
    }
    function render() {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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