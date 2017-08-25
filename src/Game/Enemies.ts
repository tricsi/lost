namespace Game {

    export class Enemies {

        freq: number;
        limit: number;
        items: Item[] = [];
        index: number = 0;
        factory: (index: number) => Item;

        constructor(freq: number, limit: number, factory: (index: number) => Item) {
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