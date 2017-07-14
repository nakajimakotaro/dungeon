import {AI} from "./AI";
import { Point } from "./shape";
import { Game } from "./game";
import { Character } from "./character";

function rangeRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
function rangeRandomInt(min: number, max: number): number {
    return Math.floor(rangeRandom(min, max));
}
function shuffle<T>(array: Array<T>) {
    for (let a = 0; a < array.length - 1; a++) {
        let b = rangeRandomInt(a, array.length);
        let tmp = array[a];
        array[a] = array[b];
        array[b] = tmp;
    }
    return array;
}

export interface TerritoryAIParameter{
    name: "TerritoryAI",
    range: number,
    pin?: Point,
}

export class TerritoryAI implements AI {
    constructor(public game: Game, public chara: Character, public territoryRange: number, public territoryPin?) {
        this.territoryPin = this.territoryPin ? this.territoryPin : chara.pos.clone();
    }
    static generate(game:Game, chara: Character, parameter:TerritoryAIParameter){
        return new TerritoryAI(game, chara, parameter.range, parameter.pin);
    }
    update() {
        if (this.game.frame % 30 == 0) {
            this.walk();
        }
    }
    isInTerritory(x: number, y: number) {
        return Math.hypot(x - this.territoryPin.x, y - this.territoryPin.y) < this.territoryRange;
    }
    walk() {
        let angle: number | null = null;
        //縄張りの中からはみ出さないようランダムに向きを決める
        for (let tryAngle of shuffle([0, Math.PI / 2, Math.PI, Math.PI + Math.PI / 2])) {
            let tryMoveX = this.chara.pos.x + Math.round(Math.cos(tryAngle));
            let tryMoveY = this.chara.pos.y + Math.round(Math.sin(tryAngle)) * -1;
            if (this.isInTerritory( tryMoveX, tryMoveY) &&
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