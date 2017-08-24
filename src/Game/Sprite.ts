namespace Game {

    export class Sprite {

        img: HTMLImageElement;
        ictx: CanvasRenderingContext2D;
        width: number;
        static load: number = 0;
        static loaded: number = 0;

        constructor(ictx: CanvasRenderingContext2D, src: string, width: number, callback: any = null) {
            Sprite.load++;
            this.img = new Image();
            this.img.onload = () => {
                Sprite.loaded++;
                if (callback) {
                    callback.call(this);
                }
            };
            this.img.src = src;
            this.ictx = ictx;
            this.width = width;
        }

        render(ctx: CanvasRenderingContext2D, box: Box, top:number, frame: number, left: number = 0): void {
            let pos = box.pos,
                x = pos.x,
                y = pos.y,
                w = box.w,
                h = box.h;
            top *= h;
            left += w * frame;
            ctx.drawImage(this.img, left, top, w, h, x, y, w, h);
            if (x + w > this.width) {
                ctx.drawImage(this.img, left, top, w, h, x - this.width, y, w, h);
            }
        }

        crop(
            x: number,
            y: number,
            w: number,
            h: number,
            colors: number[][] = [],
            flipV: boolean = false,
            flipH: boolean = false
        ) {
            let ctx = this.ictx,
                canvas = ctx.canvas,
                width = canvas.width,
                height = canvas.height,
                copies = colors.length;
            canvas.width = w;
            canvas.height = h * (copies + 1);
            ctx.save();
            ctx.translate(flipV ? w : 0, flipH ? h : 0);
            ctx.scale(flipV ? -1 : 1, flipH ? -1 : 1);
            ctx.drawImage(this.img, x, y, w, h, 0, 0, w, h);
            ctx.restore();
            if (copies > 0) {
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const length = imgData.data.length / (copies + 1);
                for (let i = 0; i < length; i += 4) {
                    if (!imgData.data[i + 3]) {
                        continue;
                    }
                    for (let j = 0; j < 4; j++) {
                        for (let k = 0; k < copies; k++) {
                            let c = imgData.data[i + j];
                            if (colors[k].length > j) {
                                c -= 255 - colors[k][j];
                            }
                            let l = (k + 1) * length + i + j;
                            imgData.data[l] = c > 0 ? c : 0;
                        }
                    }
                }
                ctx.putImageData(imgData, 0, 0);
            }
            const sprite = new Sprite(ctx, canvas.toDataURL(), this.width);
            canvas.width = width;
            canvas.height = height;
            return sprite;
        }

    }

}