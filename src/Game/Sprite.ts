namespace Game {

    export class Sprite {

        img: HTMLImageElement;

        constructor(img: HTMLImageElement) {
            this.img = img;
        }

        render(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, top:number, frame: number): void {
            ctx.drawImage(this.img, w * frame, top, w, h, x, y, w, h);
        }

        crop(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, flipV: boolean = false, flipH: boolean = false) {
            let img = new Image(),
                canvas = ctx.canvas,
                width = canvas.width,
                height = canvas.height;
            canvas.width = w;
            canvas.height = h;
            ctx.save();
            ctx.translate(flipV ? w : 0, flipH ? h : 0);
            ctx.scale(flipV ? -1 : 1, flipH ? -1 : 1);
            ctx.drawImage(this.img, -x, -y);
            ctx.restore();
            img.src = canvas.toDataURL();
            canvas.width = width;
            canvas.height = height;
            return new Sprite(img);
        }
    }

}