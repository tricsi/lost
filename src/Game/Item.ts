namespace Game {

    export interface Item {

        collided: Vec;
        speed: Vec;
        frame: number;
        walk: boolean;
        box: Box;

        render(ctx: CanvasRenderingContext2D): void;
        update(tick: number): void;
    }

}