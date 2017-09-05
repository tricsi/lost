namespace Game {

    export class Menu implements SceneInterface {

        tick: number = 0;
        active: number = 0;
        planet: Planet = new Planet(false);
        title: Txt;
        items: Txt[];
        onstart: () => void;

        constructor(title: string, onstart: () => void) {
            this.title = new Txt(128 - (title.length * 3), 56, title, 0);
            this.items = [
                new Txt(104, 80, 'New Game', 0)
            ];
            this.onstart = onstart;
        }

        input(keys: object, e: KeyboardEvent): void {
            if (e.shiftKey && e.type === 'keydown') {
                this.onstart();
            }
        }

        render(ctx: CanvasRenderingContext2D): void {
            this.planet.render(ctx);
            this.title.render(ctx);
            this.items.forEach(item => {
                item.render(ctx);
            });
        }

        update(): void {
            this.items[this.active].invert = this.tick++ % 60 > 30;
        }

        complete(): boolean {
            return false;
        }

    }
}