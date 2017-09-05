namespace Game {

    export class Session {

        private static insta: Session;
        private static store: string = 'LoST_hi';
        lives: number = 0;
        score: number = 0;
        high: number;

        livesTxt: Txt;
        scoreTxt: Txt;
        highTxt: Txt;

        private constructor() {
            this.high = JSON.parse(localStorage.getItem(Session.store)) || 0;
            this.livesTxt = new Txt(120, 8, '', 1);
            this.scoreTxt = new Txt(0, 8, '', 1);
            this.highTxt = new Txt(213, 8, '', 1);
        }

        static get(): Session {
            if (!Session.insta) {
                Session.insta = new Session();
            }
            return Session.insta;
        }

        init() {
            this.lives = 4;
            this.score = 0;
        }

        add(score: number): void {
            this.score += score;
            if (this.score > this.high) {
                this.high = this.score;
                localStorage.setItem(Session.store, JSON.stringify(this.high));
            }
        }

        inc(): void {
            this.lives++;
        }

        dec(): void {
            if (this.lives) {
                this.lives--;
            }
        }

        render(ctx: CanvasRenderingContext2D): void {
            this.scoreTxt.text = ('000000' + this.score).slice(-7);
            this.scoreTxt.render(ctx);
            this.livesTxt.text = ('0' + this.lives).slice(-2);
            this.livesTxt.render(ctx);
            this.highTxt.text = ('000000' + this.high).slice(-7);
            this.highTxt.render(ctx);
        }

    }

}