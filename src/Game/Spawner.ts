namespace Game {

    export class Spawner {

        freq: number;
        limit: number;
        items: Item[] = [];
        index: number = 0;
        factory: (index: number) => Item;

        constructor(factory: (index: number) => Item, level: number = 0) {
            let replay = Math.floor(level / 8),
                freq = 64 - level,
                limit = 4 + replay;
            this.freq = freq < 8 ? 8 : freq;
            this.limit = limit < 8 ? limit : 8;
            this.factory = factory;
        }

        update(tick: number) {
            if (tick % this.freq == 0 && this.items.length < this.limit) {
                const item = this.factory.call(this, this.index++);
                this.items.push(item);
            }
            this.items.forEach(enemy => {
                enemy.update(tick);
            });
        }

        render(ctx: CanvasRenderingContext2D) {
            this.items.forEach(enemy => {
                enemy.render(ctx);
            });
        }

    }

}