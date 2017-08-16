namespace Game {

    export class Rect {

        pos: Vec;
        w: number;
        h: number;

        constructor(pos: Vec, w: number, h: number){
            this.pos = pos;
            this.w = w;
            this.h = h;
        }

        test(rect: Rect): Rect {
            let result: Rect = null;
            if (
                this.pos.x < rect.pos.x + rect.w &&
                this.pos.x + this.w > rect.pos.x &&
                this.pos.y < rect.pos.y + rect.h &&
                this.h + this.pos.y > rect.pos.y
            ) {
                let Ax = this.pos.x,
                    Ay = this.pos.y,
                    AX = Ax + this.w,
                    AY = Ay + this.h,
                    Bx = rect.pos.x,
                    By = rect.pos.y,
                    BX = Bx + rect.w,
                    BY = By + rect.h,
                    Cx = Ax < Bx ? Bx : Ax,
                    Cy = Ay < By ? By : Ay,
                    CX = AX < BX ? AX : BX,
                    CY = AY < BY ? AY : BY;
                result = new Rect(new Vec(Cx, Cy), CX - Cx, CY- Cy);
            }
            return result;
        }
    }

}