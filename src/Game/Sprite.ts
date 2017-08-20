namespace Game {

    export class Sprite {

        img: HTMLImageElement;
        width: number;
        loaded: boolean = false;

        constructor(src: string, width: number, callback: any = null) {
            this.img = new Image();
            this.img.onload = () => {
                this.loaded = true;
                if (callback) {
                    callback.call(this);
                }
            };
            this.img.src = src;
            this.width = width;
        }

        render(ctx: CanvasRenderingContext2D, box: Box, top:number, frame: number): void {
            let pos = box.pos,
                x = pos.x,
                y = pos.y,
                w = box.w,
                h = box.h;
            top *= h;
            ctx.drawImage(this.img, w * frame, top, w, h, x, y, w, h);
            if (x + w > this.width) {
                ctx.drawImage(this.img, w * frame, top, w, h, x - this.width, y, w, h);
            }
        }

        crop(
            ctx: CanvasRenderingContext2D,
            x: number,
            y: number,
            w: number,
            h: number,
            colors: number[][] = [],
            callback: any = null,
            flipV: boolean = false,
            flipH: boolean = false
        ) {
            let canvas = ctx.canvas,
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
            const sprite = new Sprite(canvas.toDataURL(), this.width, callback);
            canvas.width = width;
            canvas.height = height;
            return sprite;
        }

    }

}