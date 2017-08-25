/// <reference path="../typings/index.d.ts" />

namespace Game {

    function $(query: string, element?: NodeSelector): Element {
        return (element || document).querySelector(query);
    }

    function on(element: any, event: string, callback: EventListenerOrEventListenerObject) {
        element.addEventListener(event, callback, false);
    }

    let canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
        scene: Scene;

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
            scene.input(keys, e);
        });
        on(document, 'keyup', (e: KeyboardEvent) => {
            keys[e.keyCode] = false;
            scene.input(keys, e);
        });
        on(window, 'resize', resize);
    }

    function update(): void {
        requestAnimationFrame(() => {
            update();
        });
        if (Sprite.ready()) {
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
            Hero.sprite = sprite.crop(0, 0, 64, 48);
            Hero.jetSprite = sprite.crop(64, 0, 48, 48, ['fc0']);
            Bumm.sprite = sprite.crop(0, 152, 48, 16, ['fc0']);
            Platform.sprite = sprite.crop(0, 80, 24, 8, ['0c0', 'fc0']);
            Enemy.sprite = sprite.crop(0, 48, 48, 16, ['f66', 'f6f', '66f', '6ff']);
            Laser.sprite1 = sprite.crop(0, 180, 112, 1, ['f6f', 'f66', '6ff']);
            Laser.sprite2 = sprite.crop(0, 180, 112, 1, ['f6f', 'f66', '6ff'], true);
            Ship.sprite = sprite.crop(0, 88, 64, 48, ['f6f']);
            Hero.jetSfx = new Sfx([3,,1,,,.61,,1,1,,,-1,,,-1,,-.76,-.02,.456,0,.18,,-1,.5]);
            Bumm.sfx = new Sfx([3,,.38,.47,.29,.09,,,,,,,,,,.55,.34,-.13,1,,,,,.5]);
            Laser.sfx = new Sfx([0,,.12,,.16,.3,.2,-.17,,,,,,.55,-.45,,,,1,,,,,.5]);
            scene = new Scene(sprite);
            resize();
            bind();
            update();
        });
    });
}