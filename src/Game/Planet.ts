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
            this.renderStars(ctx, 200, .5);
            this.renderMoon(ctx, 210, 100, 20, '#ccc');
            this.renderSky(ctx, [32,32,64,0]);
            this.renderGround(ctx, '#000');
            this.txts.forEach(txt => txt.render(ctx));
            this.platforms.forEach(platform => platform.render(ctx));
            this.cache = new Image();
            this.cache.src = ctx.canvas.toDataURL();
        }

        protected renderSky(ctx: CanvasRenderingContext2D, color:number[]): void {
            let canvas = ctx.canvas,
                sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
            sky.addColorStop(0, `rgba(${color.join(',')})`);
            sky.addColorStop(1, `rgba(${color.slice(0,3).join(',')},1)`);
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        protected renderStars(ctx: CanvasRenderingContext2D, count: number, alpha: number): void {
            for (let i = 0; i < count; i++) {
                let color = Rand.get(alpha);
                ctx.fillStyle = `rgba(255,255,255,${color})`;
                ctx.fillRect(Math.round(Rand.get(255)), Math.round(Rand.get(192)), 1, 1);
            }
        }

        protected renderMoon(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        }

        protected renderGround(ctx: CanvasRenderingContext2D, color: string): void {
            let canvas = ctx.canvas,
                i = 0,
                x = 0,
                w = canvas.width,
                h = canvas.height,
                y = h / 3 * 2;
            ctx.beginPath();
            ctx.moveTo(x, y + Rand.get(30));
            while (x < w) {
                let x1 = x + Rand.get(30, 20),
                    x2 = x1 + Rand.get(30, 20),
                    y1 = y + Rand.get(20),
                    y2 = y + Rand.get(20);
                ctx.lineTo(x1 < w ? x1 : w, y1);
                ctx.lineTo(x2 < w ? x2 : w, y2);
                //ctx.quadraticCurveTo(x1, y1, x2, y2);
                x = x2;
            }
            ctx.lineTo(w, h);
            ctx.lineTo(0, h);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        }

    }

}