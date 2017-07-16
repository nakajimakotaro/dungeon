import { Game } from "../game";
import { Character } from "../character";
import { Point } from "../shape";
import {AI, AIParameter} from "./AI";
export type PlayerControlParameter = {
    name:string,
}
export class PlayerControl implements AI {
    constructor(public game: Game, public chara: Character) {
    }
    static generate(game: Game, chara: Character, parameter:AIParameter){
        return new PlayerControl(game, chara);
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