namespace Game {

    export class Planet {

        txts: Txt[];
        platforms: Platform[];
        cache: HTMLImageElement;
        sky: number[];
        rocks: string;
        stars: number;
        moons: string[];

        constructor(
            platforms: Platform[] = [],
            sky: number[] = [32,32,64,0],
            rocks: string = '#000',
            stars: number = 200,
            moons: string[] = ['#ccc'],
            ground: number = 0
        ) {
            this.sky = sky;
            this.rocks = rocks;
            this.stars = stars;
            this.moons = moons;
            this.txts = [
                new Txt(0, 0, 'Score'),
                new Txt(120, 0, 'HP', 2),
                new Txt(231, 0, 'High'),
            ];
            this.platforms = platforms;
            if (platforms.length) {
                platforms.unshift(
                    new Platform(-50, 184, 350, ground || platforms[0].color),
                    new Platform(-50, 8, 350, -1)
                );
            }
        }

        render(ctx: CanvasRenderingContext2D): void {
            if (this.cache) {
                ctx.drawImage(this.cache, 0, 0);
            } else {
                let canvas = ctx.canvas;
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                //stars
                for (let i = 0; i < this.stars; i++) {
                    let color = Rand.get(.5);
                    ctx.fillStyle = `rgba(255,255,255,${color})`;
                    ctx.fillRect(Math.round(Rand.get(255)), Math.round(Rand.get(192)), 1, 1);
                }

                //moons
                this.moons.forEach(color => {
                    let x = Rand.get(200, 40),
                        y = Rand.get(130, 80),
                        r = Rand.get(40, 10);
                    ctx.fillStyle = color;
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                });

                //sky
                let sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
                sky.addColorStop(0, `rgba(${this.sky.join(',')})`);
                sky.addColorStop(1, `rgba(${this.sky.slice(0,3).join(',')},1)`);
                ctx.fillStyle = sky;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                //rocks
                let i = 0,
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
                    x = x2;
                }
                ctx.lineTo(w, h);
                ctx.lineTo(0, h);
                ctx.closePath();
                ctx.fillStyle = this.rocks;
                ctx.fill();

                this.txts.forEach(txt => txt.render(ctx));
                this.platforms.forEach(platform => platform.render(ctx));
                this.cache = new Image();
                this.cache.src = ctx.canvas.toDataURL();
            }
            Session.get().render(ctx);
        }

    }

}