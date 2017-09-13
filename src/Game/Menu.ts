namespace Game {

    export class Menu implements SceneInterface {

        static sfx: Sfx;
        tick: number = 0;
        active: number = 0;
        title: Txt;
        items: Txt[];
        hint: Txt;
        planet: Planet = new Planet();
        onstart: () => void;

        constructor(title: string, onstart: () => void) {
            this.title = new Txt(128 - (title.length * 3), 56, title, 0);
            this.items = [
                new Txt(86, 80, 'Start New Game'),
                new Txt(83, 96),
                new Txt(80, 112, 'Reset High Score'),
                new Txt(92, 128),
            ];
            this.hint = new Txt(8, 184, 'Move with Arrow keys and fire with Shift', 2);
            this.onstart = onstart;
        }

        stop() {};

        input(keys: object, down: boolean): void {
            if (!down) {
                return;
            }
            let sfx = false;;
            if (keys[0]) {
                switch (this.active) {
                    case 0:
                        this.onstart();
                        break;
                    case 1:
                        fullscreen();
                        break;
                    case 2:
                        Session.get().clear();
                        break;
                    case 3:
                        let gain = Sfx.master.gain;
                        gain.value = gain.value ? 0 : 1;
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
            this.items[1].text = 'Full Screen ' + (document.webkitFullscreenElement ? ' On' : 'Off');
            this.items[3].text = 'Sound FX ' + (Sfx.master.gain.value ? ' On' : 'Off');
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