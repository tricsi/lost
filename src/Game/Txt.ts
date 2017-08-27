namespace Game {

    export class Txt {

        static sprite: Sprite;
        box: Box;
        text: string;
        color: number;

        constructor(pos: Vec, text: string, color: number = 0) {
            this.box = new Box(pos, 6, 7);
            this.text = text;
            this.color = color;
        }

        render(ctx: CanvasRenderingContext2D) {
            let box = this.box.clone();
            for(let i = 0; i < this.text.length; i++) {
                let char = this.text.charCodeAt(i);
                let top = this.color * 2;
                if (char >= 48 && char <= 57) {
                    Txt.sprite.render(ctx, box, top, char - 48);
                }
                if (char >= 97 && char <= 122) {
                    char -= 32;
                }
                if (char >= 65 && char <= 90) {
                    char -= 55;
                    if (char >= 18) {
                        char -= 18;
                        top++;
                    }
                    Txt.sprite.render(ctx, box, top, char);
                }
                box.pos.x += box.w;
            }
        }
    }
}