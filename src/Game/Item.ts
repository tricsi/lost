namespace Game {

    export interface Item {

        collided: Vec;
        speed: Vec;
        box: Box;

        render(ctx: CanvasRenderingContext2D): void;
        update(tick: number): void;
    }

}