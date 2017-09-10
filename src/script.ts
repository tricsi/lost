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
        const keys = {};
        on(document, 'keydown', (e: KeyboardEvent) => {
            if (e.keyCode == 27) {
                start();
                return;
            }
            keys[e.keyCode] = true;
            scene.input(keys, e);
        });
        on(document, 'keyup', (e: KeyboardEvent) => {
            keys[e.keyCode] = false;
            scene.input(keys, e);
        });
        on(window, 'resize', resize);
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

    function update(): void {
        requestAnimationFrame(() => {
            update();
        });
        if (!Sprite.ready() || !Sfx.ready()) {
            return;
        }
        if (scene instanceof Scene && !session.lives && scene.hero.tick > -120) {
            start('Game Over');
        } else if (scene.complete()) {
            scene = factory(++level);
        }
        scene.update();
        scene.render(ctx);
        session.render(ctx);
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
            update();
        });
    });
}