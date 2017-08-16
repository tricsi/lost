namespace Game {

    export interface Item {

        render(ctx: CanvasRenderingContext2D): void;

        update(): void;

    }

}