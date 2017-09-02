/// <reference path="../typings/index.d.ts" />

namespace Game {

    function $(query: string, element?: NodeSelector): Element {
        return (element || document).querySelector(query);
    }

    function on(element: any, event: string, callback: EventListenerOrEventListenerObject) {
        element.addEventListener(event, callback, false);
    }

    export class Rand {

        static seed: number = Math.round(Math.random() * 1000);

        static get(max: number = 1, min: number = 0): number {
            Rand.seed = (Rand.seed * 9301 + 49297) % 233280;
            return min + (Rand.seed / 233280) * (max - min);
        }

    }
    
    let canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        scene: Scene,
        level: number = 0;

    function resize(): void {
        let body = document.body,
            portrait = body.clientWidth / body.clientHeight < canvas.width / canvas.height;
        canvas.style.width = portrait ? '100%' : '';
        canvas.style.height = portrait ? '' : '100%';
    }
    
    function bind(): void {
        const keys = {};
        on(document, 'keydown', (e: KeyboardEvent) => {
            keys[e.keyCode] = true;
            if (scene) {
                scene.input(keys, e);
            }
        });
        on(document, 'keyup', (e: KeyboardEvent) => {
            keys[e.keyCode] = false;
            if (scene) {
                scene.input(keys, e);
            }
        });
        on(window, 'resize', resize);
    }

    function update(): void {
        requestAnimationFrame(() => {
            update();
        });
        if (Sprite.ready() && Sfx.ready()) {
            if (!scene || scene.complete()) {
                switch(level % 4) {
                    case 1: scene = new Scene2(level); break;
                    case 2: scene = new Scene3(level); break;
                    case 3: scene = new Scene4(level); break;
                    default: scene = new Scene1(level);
                }
                level++;
            }
            scene.update();
            scene.render(ctx);
        }
    }

    on(window, 'load', () => {
        canvas = <HTMLCanvasElement>$('#game');
        ctx = canvas.getContext('2d');
        const ictx = (<HTMLCanvasElement>$('#test')).getContext('2d');
        const src = 'data:image/gif;base64,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';
        const sprite = new Sprite(ictx, src, canvas.width, () => {
            Scene.sprite = sprite;
            Hero.sprite = sprite.crop(0, 0, 64, 48);
            Hero.jetSprite = sprite.crop(64, 0, 48, 48, ['fc0']);
            Bumm.sprite = sprite.crop(0, 152, 48, 16, ['fc0']);
            Platform.sprite = sprite.crop(0, 80, 24, 8, ['0c0', 'fc0']);
            Laser.sprite1 = sprite.crop(0, 180, 112, 1, ['f6f', 'f66', '6ff']);
            Laser.sprite2 = sprite.crop(0, 180, 112, 1, ['f6f', 'f66', '6ff'], true);
            Loot.sprite = sprite.crop(16, 168, 80, 12, ['f0f', '0ff', 'ff0']);
            Fuel.sprite = sprite.crop(0, 168, 16, 12, ['f0f']);
            Ship.sprite = sprite.crop(0, 88, 64, 48, ['f6f']);
            Ship.jetSprite = sprite.crop(0, 136, 48, 16, ['fc0']);
            Txt.sprite = sprite.crop(0, 181, 108, 14, ['ff0', '0ff']);
            Hero.jetSfx = new Sfx([3,,1,,,.61,,1,1,,,-1,,,-1,,-.76,-.02,.456,0,.18,,-1,.5]);
            Hero.pickSfx = new Sfx([0,,.09,.37,.18,.47,,,,,,.42,.67,,,,,,1,,,,,.5]);
            Bumm.sfx = new Sfx([3,,.38,.47,.29,.09,,,,,,,,,,.55,.34,-.13,1,,,,,.5]);
            Laser.sfx = new Sfx([0,,.12,,.16,.3,.2,-.17,,,,,,.55,-.45,,,,1,,,,,.5]);
            Loot.sfx = new Sfx([0,,.11,,.19,.23,,.46,,,,,,.44,,.53,,,1,,,,,.5]);
            Ship.goSfx = new Sfx([3,,1,,1,.14,,.08,,,,,,,,,,,1,,,,,.5]);
            Ship.landSfx = new Sfx([3,,1,,1,.2,,.08,-.05,,,,,,,,,,1,,,,,.5]);
            Ship.buildSfx = new Sfx([0,,.07,.55,.1,.54,,,,,,.35,.69,,,,,,1,,,,,.5]);
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
            bind();
            update();
        });
    });
}