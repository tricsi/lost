namespace Game {

    export class Sprite {

        img: HTMLImageElement;
        width: number;

        constructor(img: HTMLImageElement, width: number) {
            this.img = img;
            this.width = width;
        }

        render(ctx: CanvasRenderingContext2D, box: Box, top:number, frame: number): void {
            let pos = box.pos,
                x = pos.x,
                y = pos.y,
                w = box.w,
                h = box.h;
            ctx.drawImage(this.img, w * frame, top, w, h, x, y, w, h);
            if (x + w > this.width) {
                ctx.drawImage(this.img, w * frame, top, w, h, x - this.width, y, w, h);
            }
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
            return new Sprite(img, this.width);
        }
    }

}