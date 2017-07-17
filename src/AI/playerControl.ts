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
        if(this.game.frame % 10 != 0){
            return;
        }
        this.inputDirection();
        if(this.walk()){
            const frontCell = this.chara.frontOf();
            if(!frontCell){
                return;
            }
            const frontChara = frontCell.chara;
            if(!frontChara){
                return;
            }
            if(frontChara.group == "enemy"){
                frontCell.fireCause({pos: new Point(frontCell.x, frontCell.y), damege: 5, heal: 0, special: ""});
            }
        }
    }
    walk() {
        if (this.chara.frontOf()) {
            return this.chara.move(this.chara.angle);
        }
        return false;
    }
    inputDirection(){
        if (this.game.inputManager.getKeyStatus("w") == "push") {
            this.chara.angle = Math.PI / 2;
        } else if (this.game.inputManager.getKeyStatus("a") == "push") {
            this.chara.angle = Math.PI;
        } else if (this.game.inputManager.getKeyStatus("s") == "push") {
            this.chara.angle = Math.PI + Math.PI / 2;
        } else if (this.game.inputManager.getKeyStatus("d") == "push") {
            this.chara.angle = 0;
        }
    }
}