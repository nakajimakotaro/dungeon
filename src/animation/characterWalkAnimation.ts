import {Animation, AnimationManager} from "./animation";
import {Character} from "../character";
import {Game} from "../game";

class CharacterWalkAnimation extends Animation{
    name: string;
    player: Character;
    sprite: PIXI.Sprite;
    speed = 4;
    constructor(public game:Game){
        super();
    }
    startFunc(): void{
    }
    updateFunc(): void{
        this.draw(this.game.render);
    }
    endFunc(): void{
    }
    transformFunc(manager: AnimationManager): void{
    }
    draw(render: PIXI.Graphics) {
        const cellSize = this.game.gameMap.cellSize;
        render
            .drawRect(this.player.pos.x * cellSize, this.player.pos.y * cellSize, cellSize, cellSize);
    }
}