namespace Game {

    export class Menu implements SceneInterface {

        static sfx: Sfx;
        tick: number = 0;
        active: number = 0;
        planet: Planet = new Planet(false);
        title: Txt;
        items: Txt[];
        onstart: () => void;

        constructor(title: string, onstart: () => void) {
            this.title = new Txt(128 - (title.length * 3), 56, title, 0);
            this.items = [
                new Txt(86, 80, 'Start New Game', 0),
                new Txt(86, 96, 'Sound FX    on', 0),
            ];
            this.onstart = onstart;
        }

        input(keys: object, e: KeyboardEvent): void {
            if (e.type !== 'keydown') {
                return;
            }
            let active = this.items[this.active],
                sfx = false;;
            if (e.shiftKey) {
                switch (this.active) {
                    case 0:
                        this.onstart();
                        sfx = true;
                        break;
                    case 1:
                        if (Sfx.master.gain.value) {
                            active.text = 'Sound FX   off';
                            Sfx.master.gain.value = 0;
                        } else {
                            active.text = 'Sound FX    on';
                            Sfx.master.gain.value = 1;
                        }
                        sfx = true;
                        break;
                }
            } else if (keys[38] || keys[87] || keys[90]) {
                if (--this.active < 0) {
                    this.active += this.items.length;
                }
                sfx = true;
            }
            if (sfx) {
                Menu.sfx.play();
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
            this.items.forEach((item, i) => {
                item.invert = i == this.active && this.tick % 50 > 25;
            });
            this.tick++;
        }

        complete(): boolean {
            return false;
        }

    }
}