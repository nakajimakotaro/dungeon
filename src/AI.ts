import { rangeRandomInt } from "util";
import { Game } from "./game";
import { Point } from "./shape";

export class TerritoryAI {
    territoryPin: Point;
    territoryRange: number;
    constructor(public game:Game, x:number, y:number) {
        this.territoryPin = new Point(x, y);
        this.territoryRange = 5;
    }
    update() {
    }
    isInTerritory(w: number, h: number) {
        return Math.hypot(w, h) < this.territoryRange;
    }
    walk() {
        let tryAngle: number;
        //縄張りの中からはみ出さないようランダムに向きを決める
        do {
            tryAngle = this.trun([0, Math.PI / 2, Math.PI, Math.PI + Math.PI / 2][rangeRandomInt(0, 4)]);
        } while (
            !isInTerritory(
                this.pos.x + Math.round(Math.cos(tryAngle)) - this.territoryPin.x,
                this.pos.y + Math.round(Math.sin(tryAngle)) * -1 - this.territoryPin.y)
        );
        this.angle = tryAngle;
        this.move(this.angle);
    }
}