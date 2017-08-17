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
        const speed = scene.hero.speed;
        on(document, 'keydown', (e: KeyboardEvent) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119) {
                speed.y = -1;
            } else if (key == 37 || key == 65 || key == 97) {
                speed.x = -1;
            } else if (key == 39 || key == 68 || key == 100) {
                speed.x = 1;
            }
        });
        on(document, 'keyup', (e: KeyboardEvent) => {
            let key = e.keyCode;
            if (key == 38 || key == 87 || key == 119 || key == 40 || key == 83 || key == 115) {
                speed.y = 1;
            } else if (key == 37 || key == 65 || key == 97 || key == 39 || key == 68 || key == 100) {
                speed.x = 0;
            }
        });
    }

    function render(): void {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        canvas = <HTMLCanvasElement>$(id);
        ctx = canvas.getContext('2d');
        scene = new Scene();
        bind();
        update();
    }

}

Game.run('#game');