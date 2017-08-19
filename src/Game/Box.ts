namespace Game {

    export class Box {

        pos: Vec;
        w: number;
        h: number;

        constructor(pos: Vec, w: number, h: number){
            this.pos = pos;
            this.w = w;
            this.h = h;
        }

        test(box: Box): boolean {
            return this.pos.x < box.pos.x + box.w &&
                this.pos.x + this.w > box.pos.x &&
                this.pos.y < box.pos.y + box.h &&
                this.h + this.pos.y > box.pos.y;
        }

        intersect(box: Box): Box {
            let Ax = this.pos.x,
                Ay = this.pos.y,
                AX = Ax + this.w,
                AY = Ay + this.h,
                Bx = box.pos.x,
                By = box.pos.y,
                BX = Bx + box.w,
                BY = By + box.h,
                Cx = Ax < Bx ? Bx : Ax,
                Cy = Ay < By ? By : Ay,
                CX = AX < BX ? AX : BX,
                CY = AY < BY ? AY : BY;
            return new Box(
                new Vec(Cx, Cy),
                CX - Cx,
                CY- Cy
            );
        }

        clone(): Box {
            return new Box(this.pos.clone(), this.w, this.h);
        }

    }

}