namespace Game {

    export class Spawner {

        freq: number;
        limit: number;
        items: Item[] = [];
        index: number = 0;
        factory: (index: number) => Item;

        constructor(factory: (index: number) => Item, freq: number = 64, limit: number = 4) {
            this.freq = freq;
            this.limit = limit;
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