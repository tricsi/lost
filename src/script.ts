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
        scene.update();
        scene.render(ctx);
    }

    on(window, 'load', () => {
        canvas = <HTMLCanvasElement>$('#game');
        ctx = canvas.getContext('2d');
        const ictx = (<HTMLCanvasElement>$('#test')).getContext('2d');
        const src = 'data:image/png;base64,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';
        const sprite = new Sprite(src, canvas.width, function() {
            scene = new Scene(ictx, sprite);
            resize();
            bind();
            update();
        });
    });
}