import { Game } from "../game"; 
import "pixi.js";
import { Character } from "../character";
import { AI, AIParameter } from "./AI";
export class NoneAI implements AI {
    constructor(public game: Game, public chara: Character) {
    }
    static generate(game: Game, chara: Character, parameter: AIParameter) {
        return new NoneAI(game, chara);
    }
    update() {
    }
    turnStart(){
    }
    turnUpdate(){
        this.game.gameMap.turnManager.turnNext();
    }
}