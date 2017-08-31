namespace Game {

    
    export class Loot implements Item {

        static sprite: Sprite;
        static sfx: Sfx;
        collided: Vec = new Vec(0, 0);
        speed: Vec = new Vec(0, .5);
        box: Box;
        type: number;
        color: number;
        
        constructor() {
            let x = Math.round(Math.random() * 30) * 8;
            this.box = new Box(new Vec(x, 16), 16, 12);
            this.type = Math.round(Math.random() * 4);
            this.color = Math.round(Math.random() * 2) + 1;
        }

        render(ctx: CanvasRenderingContext2D): void {
            Loot.sprite.render(ctx, this.box, this.color, this.type);
        }

        update(tick: number): void {}

    }
    
}