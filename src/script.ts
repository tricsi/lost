/// <reference path="../typings/index.d.ts" />

namespace Game {

    function $(query: string, element?: NodeSelector): Element {
        return (element || document).querySelector(query);
    }

    function on(element: any, event: string, callback: EventListenerOrEventListenerObject) {
        element.addEventListener(event, callback, false);
    }

    export class Rand {

        static seed: number = Math.random();

        static get(max: number = 1, min: number = 0): number {
            Rand.seed = (Rand.seed * 9301 + 49297) % 233280;
            return min + (Rand.seed / 233280) * (max - min);
        }

    }
    
    let canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        keys: object = {},
        scene: SceneInterface,
        level: number,
        session: Session;

    function resize(): void {
        let body = document.body,
            portrait = body.clientWidth / body.clientHeight < canvas.width / canvas.height;
        canvas.style.width = portrait ? '100%' : '';
        canvas.style.height = portrait ? '' : '100%';
    }
    
    function bind(): void {
        on(document, 'keydown', (e: KeyboardEvent) => {
            if (e.keyCode == 27) {
                if (scene instanceof Scene) {
                    start();
                }
                return;
            }
            keys[e.keyCode] = true;
            keys[0] = keys[13] || keys[32] || e.shiftKey || e.ctrlKey;
            scene.input(keys, true);
        });
        on(document, 'keyup', (e: KeyboardEvent) => {
            keys[e.keyCode] = false;
            keys[0] = keys[13] || keys[32] || e.shiftKey || e.ctrlKey;
            scene.input(keys, false);
        });
        on(window, 'resize', resize);
    }
    
    export function fullscreen() {
        if (!document.webkitFullscreenElement) {
            document.documentElement.webkitRequestFullscreen();
            canvas.requestPointerLock();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            document.exitPointerLock();
        }
    }

    function gamepad() {
        let device = navigator.getGamepads()[0];
        if (device) {
            let k = {'0':false},
                min = .25;
            device.axes.forEach((val, i) => {
                if (i % 2) {
                    k[40] = k[40] || val > min;
                    k[38] = k[38] || val < -min;
                } else {
                    k[39] = k[39] || val > min;
                    k[37] = k[37] || val < -min;
                }
            });
            device.buttons.forEach((button, i) => {
                if (button.pressed) {
                    switch (i) {
                        case 12: k[38] = true; break;
                        case 13: k[40] = true; break;
                        case 14: k[37] = true; break;
                        case 15: k[39] = true; break;
                        default: k[0] = true;
                    }
                }
            });
            for (let i in k) {
                if ((keys[i] && !k[i]) || (!keys[i] && k[i])) {
                    keys[i] = k[i];
                    scene.input(keys, k[i]);
                }
            }
        }
    }

    function start(title: string = 'L  o  S  T'): void {
        if (scene) {
            scene.stop();
        }
        scene = new Menu(title, () => {
            session.init();
            level = parseInt(location.search.substr(1)) || 0;
            scene = factory(level);
        });
    }

    function factory(level): Scene {
        switch(level % 8) {
            case 1: return new Scene1(level);
            case 2: return new Scene2(level);
            case 3: return new Scene3(level);
            case 4: return new Scene4(level);
            case 5: return new Scene5(level);
            case 6: return new Scene6(level);
            case 7: return new Scene7(level);
        }
        return new Scene0(level);
    }

    function render(): void {
        requestAnimationFrame(() => {
            render();
        });
        scene.render(ctx);
    }

    function update(): void {
        if (!Sprite.ready() || !Sfx.ready()) {
            return;
        }
        if (scene instanceof Scene && !session.lives && scene.hero.tick > -120) {
            start('Game Over');
        } else if (scene.complete()) {
            scene = factory(++level);
        }
        scene.update();
        gamepad();
    }

    on(window, 'load', () => {
        canvas = <HTMLCanvasElement>$('#game');
        ctx = canvas.getContext('2d');
        session = Session.get();
        const ictx = (<HTMLCanvasElement>$('#test')).getContext('2d');
        const src = 'data:image/gif;base64,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';
        const sprite = new Sprite(ictx, src, canvas.width, () => {
            Scene.sprite = sprite;
            Hero.sprite = sprite.crop(0, 0, 64, 48);
            Hero.jetSprite = sprite.crop(64, 0, 48, 48, ['fc0']);
            Bumm.sprite = sprite.crop(0, 152, 48, 16, ['fc0']);
            Platform.sprite = sprite.crop(0, 80, 24, 8, ['0c0', 'fc0', '930', '999', '0c9', 'c09']);
            Laser.sprite1 = sprite.crop(0, 180, 112, 1, ['f6f', 'f66', '6ff']);
            Laser.sprite2 = sprite.crop(0, 180, 112, 1, ['f6f', 'f66', '6ff'], true);
            Loot.sprite = sprite.crop(16, 168, 80, 12, ['f00', '0ff', 'ff0']);
            Fuel.sprite = sprite.crop(0, 168, 16, 12, ['f0f']);
            Ship.sprite = sprite.crop(0, 88, 64, 48, ['f6f']);
            Ship.jetSprite = sprite.crop(0, 136, 48, 16, ['fc0']);
            Txt.sprite = sprite.crop(0, 181, 108, 14, ['ff0', '0ff', '000']);
            Hero.jetSfx = new Sfx([3,,1,,,.61,,1,1,,,-1,,,-1,,-.76,-.02,.456,0,.18,,-1,.5]);
            Hero.pickSfx = new Sfx([0,,.09,.37,.18,.47,,,,,,.42,.67,,,,,,1,,,,,.5]);
            Bumm.sfx = new Sfx([3,,.38,.47,.29,.09,,,,,,,,,,.55,.34,-.13,1,,,,,.5]);
            Laser.sfx = new Sfx([0,,.12,,.16,.3,.2,-.17,,,,,,.55,-.45,,,,1,,,,,.5]);
            Loot.sfx = new Sfx([0,,.11,,.19,.23,,.46,,,,,,.44,,.53,,,1,,,,,.5]);
            Ship.goSfx = new Sfx([3,,1,,1,.14,,.08,,,,,,,,,,,1,,,,,.5]);
            Ship.landSfx = new Sfx([3,,1,,1,.2,,.08,-.05,,,,,,,,,,1,,,,,.5]);
            Ship.buildSfx = Menu.sfx = new Sfx([0,,.07,.55,.1,.54,,,,,,.35,.69,,,,,,1,,,,,.5]);
            for (let i = 48; i <= 64; i += 16) {
                Enemy.sprites.push(
                    sprite.crop(0, i, 48, 16, ['f66', 'f6f', '66f', '6ff']),
                    sprite.crop(0, i, 48, 16, ['f66', 'f6f', '66f', '6ff'], true)
                );
            }
            for (let i = 48; i <= 128; i += 16) {
                Enemy.sprites.push(
                    sprite.crop(64, i, 48, 16, ['f66', 'f6f', '66f', '6ff']),
                    null
                );
            }
            resize();
            start();
            bind();
            render();
            setInterval(update, 16);
        });
    });
}