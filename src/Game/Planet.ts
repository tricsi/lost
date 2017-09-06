namespace Game {

    export class Planet {

        cache: HTMLImageElement;
        txts: Txt[];
        platforms: Platform[];

        constructor(platforms: boolean = true) {
            this.txts = [
                new Txt(0, 0, 'Score'),
                new Txt(120, 0, 'HP', 2),
                new Txt(231, 0, 'High'),
            ];
            this.platforms = platforms ? [
                new Platform(-50, 8, 350, -1),
                new Platform(-50, 184, 350, 2),
                new Platform(32, 72, 48, 1),
                new Platform(120, 96, 32, 1),
                new Platform(192, 48, 48, 1),
            ] : [];
        }

        render(ctx: CanvasRenderingContext2D): void {
            let canvas = ctx.canvas;
            if (this.cache) {
                ctx.drawImage(this.cache, 0, 0);
                return;
            }
            Rand.seed = 72;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            this.renderStars(ctx, '#ddd');
            this.renderSky(ctx, [34,34,68,0], [34,34,68,1]);
            this.renderGround(ctx);
            this.txts.forEach(txt => txt.render(ctx));
            this.platforms.forEach(platform => platform.render(ctx));
            this.cache = new Image();
            this.cache.src = ctx.canvas.toDataURL();
        }

        protected renderSky(ctx: CanvasRenderingContext2D, color1:number[], color2:number[]): void {
            let canvas = ctx.canvas,
                sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
            sky.addColorStop(0, `rgba(${color1.join(',')})`);
            sky.addColorStop(1, `rgba(${color2.join(',')})`);
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        protected renderStars(ctx: CanvasRenderingContext2D, color: string): void {
            ctx.fillStyle = color;
            for (let i = 0; i < 40; i++) {
                ctx.beginPath();
                ctx.arc(Rand.get(255), Rand.get(192), Rand.get(1), 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        protected renderGround(ctx: CanvasRenderingContext2D): void {
            let canvas = ctx.canvas,
                i = 0,
                x = 0,
                w = canvas.width,
                h = canvas.height,
                y = h / 2;
            ctx.beginPath();
            ctx.moveTo(x, y + Rand.get(30));
            while (x < w) {
                let x1 = x + Rand.get(20, 10),
                    x2 = x1 + Rand.get(20, 10),
                    y1 = Rand.get(30),
                    y2 = y + Rand.get(30);
                ctx.lineTo(x2 < w ? x2 : w, y + Rand.get(30));
                //ctx.quadraticCurveTo(x1, i % 2 ? y + y1: y - y1, x2, y2);
                x = x2;
            }
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.fillStyle = '#000';
            ctx.fill();
        }

    }

}