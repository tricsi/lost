namespace Game {

    export class Sprite {

        img: HTMLImageElement;

        constructor(src: string) {
            this.img = new Image();
            this.img.src = src;
        }

        render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, top:number, frame: number): void {
            ctx.drawImage(this.img, w * frame, top, w, h, x, y, w, h);
        }
    }

}