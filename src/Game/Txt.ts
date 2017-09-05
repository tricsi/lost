namespace Game {

    export class Txt {

        static sprite: Sprite;
        box: Box;
        text: string;
        color: number;
        invert: boolean;

        constructor(x: number, y: number, text: string, color: number = 0, invert: boolean = false) {
            this.box = new Box(new Vec(x, y), 6, 7);
            this.text = text;
            this.color = color;
            this.invert = invert;
        }

        render(ctx: CanvasRenderingContext2D) {
            let box = this.box.clone(),
                pos = box.pos,
                length = this.text.length;
            if (this.invert) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(pos.x, pos.y, box.w * length + 1, box.h + 1);
            }
            for(let i = 0; i < length; i++) {
                let char = this.text.charCodeAt(i),
                    top = this.invert ? 6 : this.color * 2;
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