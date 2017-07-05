import { Game } from "./game";
import { Character } from "./character";
import { Point } from "./shape";

function rangeRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
function rangeRandomInt(min: number, max: number): number {
    return Math.floor(rangeRandom(min, max));
}
function shuffle<T>(array: Array<T>) {
    for (let a = 0; a < array.length - 1; a++) {
        let b = rangeRandomInt(a + 1, array.length - 1);
        let tmp = array[a];
        array[a] = array[b];
        array[b] = tmp;
    }
    return array;
}
export interface AI {
    update();
}

export class TerritoryAI implements AI {
    territoryPin: Point;
    constructor(public game: Game, public chara: Character, x: number, y: number, public territoryRange: number) {
        this.territoryPin = new Point(x, y);
    }
    update() {
        if (this.game.frame % 30 == 0) {
            this.walk();
        }
    }
    isInTerritory(w: number, h: number) {
        return Math.hypot(w, h) < this.territoryRange;
    }
    walk() {
        let angle: number | null = null;
        //縄張りの中からはみ出さないようランダムに向きを決める
        for (let tryAngle of shuffle([0, Math.PI / 2, Math.PI, Math.PI + Math.PI / 2])) {
            let tryMoveX = this.chara.pos.x + Math.round(Math.cos(tryAngle));
            let tryMoveY = this.chara.pos.y + Math.round(Math.sin(tryAngle)) * -1;
            if (this.isInTerritory(
                tryMoveX - this.territoryPin.x,
                tryMoveY - this.territoryPin.y) &&
                this.chara.canMoveTo(tryMoveX, tryMoveY)) {
                angle = tryAngle;
                break;
            }
        }
        if (angle != null) {
            this.chara.angle = angle;
            this.chara.move(this.chara.angle);
        }
    }
}
export class PlayerCntrol implements AI {
    constructor(public game: Game, public chara: Character) {
    }
    update() {
        if (this.game.frame % 5 == 0) {
            this.walk();
        }
    }
    walk() {
        const W = 87;
        const A = 65;
        const S = 83;
        const D = 68;
        let angle: number | null = null;
        if (this.game.inputManager.getKeyStatus("w") == "push") {
            angle = Math.PI / 2;
        } else if (this.game.inputManager.getKeyStatus("a") == "push") {
            angle = Math.PI;
        } else if (this.game.inputManager.getKeyStatus("s") == "push") {
            angle = Math.PI + Math.PI / 2;
        } else if (this.game.inputManager.getKeyStatus("d") == "push") {
            angle = 0;
        }
        if (angle != null) {
            this.chara.move(angle);
        }
    }
}
