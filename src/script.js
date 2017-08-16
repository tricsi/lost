var Game;
(function (Game) {
    class Hero {
        constructor(x, y) {
            this.width = 16;
            this.height = 24;
            this.pos = new SAT.Vector(x, y);
            this.speed = new SAT.Vector(0, 0);
            this.collider = new SAT.Box(this.pos, this.width, this.height);
        }
        render(ctx) {
            ctx.fillStyle = '#f0f';
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }
        update() {
            this.pos.add(this.speed);
        }
    }
    Game.Hero = Hero;
})(Game || (Game = {}));
var Game;
(function (Game) {
    class Platform {
        constructor(x, y, width, height) {
            this.pos = new SAT.Vector(x, y);
            this.width = width;
            this.height = height;
            this.collider = new SAT.Box(this.pos, width, height);
        }
        render(ctx) {
            ctx.fillStyle = '#0ff';
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        }
        update() {
        }
    }
    Game.Platform = Platform;
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
            let hero = this.hero, res = new SAT.Response();
            hero.update();
            this.platforms.forEach(platform => {
                let collided = SAT.testPolygonPolygon(platform.collider.toPolygon(), hero.collider.toPolygon(), res);
                if (collided) {
                    hero.pos.add(res.overlapV);
                }
            });
        }
    }
    Game.Scene = Scene;
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
        on(document, 'keydown', (e) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119) {
                scene.hero.speed.y = -1;
            }
            else if (key == 40 || key == 83 || key == 115) {
                scene.hero.speed.y = 1;
            }
            else if (key == 37 || key == 65 || key == 97) {
                scene.hero.speed.x = -1;
            }
            else if (key == 39 || key == 68 || key == 100) {
                scene.hero.speed.x = 1;
            }
        });
        on(document, 'keyup', (e) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119 || key == 40 || key == 83 || key == 115) {
                scene.hero.speed.y = 0;
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