var Game;
(function (Game) {
    class Hero {
        constructor(x, y) {
            this.speed = new Game.Vec(0, 1);
            this.collider = new Game.Rect(new Game.Vec(x, y), 16, 24);
        }
        render(ctx) {
            const rect = this.collider;
            ctx.fillStyle = '#f0f';
            ctx.fillRect(rect.pos.x, rect.pos.y, rect.w, rect.h);
        }
        update() {
            this.collider.pos.add(this.speed);
        }
    }
    Game.Hero = Hero;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Platform {
        constructor(x, y, width, height) {
            this.collider = new Game.Rect(new Game.Vec(x, y), width, height);
        }
        render(ctx) {
            const rect = this.collider;
            ctx.fillStyle = '#0ff';
            ctx.fillRect(rect.pos.x, rect.pos.y, rect.w, rect.h);
        }
        update() {
        }
    }
    Game.Platform = Platform;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Rect {
        constructor(pos, w, h) {
            this.pos = pos;
            this.w = w;
            this.h = h;
        }
        test(rect) {
            let result = null;
            if (this.pos.x < rect.pos.x + rect.w &&
                this.pos.x + this.w > rect.pos.x &&
                this.pos.y < rect.pos.y + rect.h &&
                this.h + this.pos.y > rect.pos.y) {
                let Ax = this.pos.x, Ay = this.pos.y, AX = Ax + this.w, AY = Ay + this.h, Bx = rect.pos.x, By = rect.pos.y, BX = Bx + rect.w, BY = By + rect.h, Cx = Ax < Bx ? Bx : Ax, Cy = Ay < By ? By : Ay, CX = AX < BX ? AX : BX, CY = AY < BY ? AY : BY;
                result = new Rect(new Game.Vec(Cx, Cy), CX - Cx, CY - Cy);
            }
            return result;
        }
    }
    Game.Rect = Rect;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Scene {
        constructor() {
            this.hero = new Game.Hero(80, 60);
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
            let hero = this.hero, res = new SAT.Response(), pos = hero.collider.pos, sign = hero.speed.sign();
            pos.add(hero.speed);
            for (let i = 0; i < this.platforms.length; i++) {
                while (this.platforms[i].collider.test(hero.collider)) {
                    pos.sub(sign);
                }
            }
            ;
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
        clone() {
            return new Vec(this.x, this.y);
        }
        add(vec) {
            this.x += vec.x;
            this.y += vec.y;
            return this;
        }
        sub(vec) {
            this.x -= vec.x;
            this.y -= vec.y;
            return this;
        }
        scale(x, y) {
            this.x *= x;
            this.y *= y;
            return this;
        }
        sign() {
            return new Vec(Math.sign(this.x), Math.sign(this.y));
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
    let canvas, ctx, speed = 2, scene;
    function bind() {
        on(document, 'keydown', (e) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119) {
                scene.hero.speed.y = -speed;
            }
            else if (key == 40 || key == 83 || key == 115) {
                scene.hero.speed.y = speed;
            }
            else if (key == 37 || key == 65 || key == 97) {
                scene.hero.speed.x = -speed;
            }
            else if (key == 39 || key == 68 || key == 100) {
                scene.hero.speed.x = speed;
            }
        });
        on(document, 'keyup', (e) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119 || key == 40 || key == 83 || key == 115) {
                scene.hero.speed.y = 1;
            }
            else if (key == 37 || key == 65 || key == 97 || key == 39 || key == 68 || key == 100) {
                scene.hero.speed.x = 0;
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