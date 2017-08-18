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
    }

    function render(): void {
        scene.render(ctx);
    }

    function update(): void {
        requestAnimationFrame(() => {
            update();
        });
        scene.update();
        render();
    }

    export function run(id: string) {
        const img = new Image();
        on(img, 'load', () => {
            canvas = <HTMLCanvasElement>$(id);
            ctx = canvas.getContext('2d');
            scene = new Scene(img);
            bind();
            update();
        });
        img.src = 'sprite.png';
    }

}

Game.run('#game');