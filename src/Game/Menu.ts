namespace Game {

    export class Menu implements SceneInterface {

        static sfx: Sfx;
        tick: number = 0;
        active: number = 0;
        planet: Planet = new Planet(false);
        title: Txt;
        items: Txt[];
        hint: Txt;
        onstart: () => void;

        constructor(title: string, onstart: () => void) {
            this.title = new Txt(128 - (title.length * 3), 56, title, 0);
            this.items = [
                new Txt(86, 80, 'Start New Game', 0),
                new Txt(80, 96, 'Reset High Score', 0),
                new Txt(92, 112, 'Sound FX  On', 0),
            ];
            this.hint = new Txt(8, 184, 'Move with arrow keys and fire with shift', 2);
            this.onstart = onstart;
        }

        stop() {};

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
                        break;
                    case 1:
                        Session.get().clear();
                        break;
                    case 2:
                        if (Sfx.master.gain.value) {
                            active.text = 'Sound FX Off';
                            Sfx.master.gain.value = 0;
                        } else {
                            active.text = 'Sound FX  On';
                            Sfx.master.gain.value = 1;
                        }
                        break;
                }
                sfx = true;
            } else if (keys[38] || keys[87] || keys[90]) {
                if (--this.active < 0) {
                    this.active += this.items.length;
                }
                sfx = true;
            } else if (keys[40] || keys[83]) {
                if (++this.active >= this.items.length) {
                    this.active -= this.items.length;
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
            this.hint.render(ctx);
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