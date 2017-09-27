import { Game } from "../game"; 
import "pixi.js";
import { Character } from "../character";
import { Point } from "../shape";
import { AI, AIParameter } from "./AI";
export type PlayerControlParameter = {
    name: string,
}
export class PlayerControl implements AI {
    constructor(public game: Game, public chara: Character) {
    }
    static generate(game: Game, chara: Character, parameter: AIParameter) {
        return new PlayerControl(game, chara);
    }
    update() {
    }
    turnUpdateCount = 0;
    isMove = false;
    turnStart(){
        this.isMove = false;
        this.turnUpdateCount = 0;
    }
    turnUpdate(){
        this.inputDirection();
        if (this.isMove == false && this.game.inputManager.getKeySomeStatus("awsd")) {
            this.isMove = true;
            this.turnUpdateCount = 0;
            const frontCell = this.chara.frontOf();
            if (frontCell == null) {
                return;
            }
            if (this.chara.canMoveTo(frontCell.x, frontCell.y)) {
                this.walk();
            } else if(frontCell.chara && frontCell.chara.group == "enemy"){
                const frontChara = frontCell.chara;
                frontCell.fireCause({ pos: new Point(frontCell.x, frontCell.y), damege: 5, heal: 0, special: "" });
            }
        }

        if(this.isMove && this.turnUpdateCount == 10){
            this.game.gameMap.turnManager.turnNext();
        }
        this.turnUpdateCount++;
    }
    walk() {
        if (this.chara.frontOf()) {
            return this.chara.move(this.chara.angle);
        }
        return false;
    }

    //入力された方向に向く
    inputDirection() {
        if (this.game.inputManager.getKeyStatus("w")) {
            this.chara.angle = Math.PI / 2;
        } else if (this.game.inputManager.getKeyStatus("a")) {
            this.chara.angle = Math.PI;
        } else if (this.game.inputManager.getKeyStatus("s")) {
            this.chara.angle = Math.PI + Math.PI / 2;
        } else if (this.game.inputManager.getKeyStatus("d")) {
            this.chara.angle = 0;
        }
    }
}
