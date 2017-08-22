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
        const hero = scene.hero;
        on(document, 'keydown', (e: KeyboardEvent) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119) {
                hero.speed.y = -1;
            } else if (key == 37 || key == 65 || key == 97) {
                hero.speed.x = -1;
                hero.face = 0;
            } else if (key == 39 || key == 68 || key == 100) {
                hero.speed.x = 1;
                hero.face = 1;
            }
        });
        on(document, 'keyup', (e: KeyboardEvent) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119 || key == 40 || key == 83 || key == 115) {
                hero.speed.y = 1;
            } else if (key == 37 || key == 65 || key == 97 || key == 39 || key == 68 || key == 100) {
                hero.speed.x = 0;
            }
        });
        on(window, 'resize', resize);
    }

    function update(): void {
        requestAnimationFrame(() => {
            update();
        });
        if (scene.ready()) {
            scene.update();
            scene.render(ctx);
        }
    }

    on(window, 'load', () => {
        canvas = <HTMLCanvasElement>$('#game');
        ctx = canvas.getContext('2d');
        const src = 'data:image/gif;base64,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';
        const sprite = new Sprite(src, canvas.width, () => {
            scene = new Scene((<HTMLCanvasElement>$('#test')).getContext('2d'), sprite);
            resize();
            bind();
            update();
        });
    });
}