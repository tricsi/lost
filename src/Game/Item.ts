namespace Game {

    export interface Item {

        collided: Vec;
        speed: Vec;
        box: Box;

        render(ctx: CanvasRenderingContext2D): void;
        update(scene: Scene): void;
    }

}