namespace Game {

    export class Planet {

        cache: HTMLImageElement;
        platforms: Platform[];

        constructor(platforms: boolean = true) {
            this.platforms = platforms ? [
                new Platform(-50, 8, 350, -1),
                new Platform(32, 72, 48, 1),
                new Platform(120, 96, 32, 1),
                new Platform(192, 48, 48, 1),
                new Platform(-50, 184, 350, 2),
            ] : [];
        }

        render(ctx: CanvasRenderingContext2D): void {
            if (this.cache) {
                ctx.drawImage(this.cache, 0, 0);
                return;
            }
            let sky = ctx.createLinearGradient(0, 0, 0, 192);
            sky.addColorStop(0, "#002");
            sky.addColorStop(1, "#224");
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.platforms.forEach(platform => {
                platform.render(ctx);
            });
            new Txt(0, 0, 'Score').render(ctx);
            new Txt(120, 0, 'HP', 2).render(ctx);
            new Txt(231, 0, 'High').render(ctx);
            this.cache = new Image();
            this.cache.src = ctx.canvas.toDataURL();
        }
    }
}