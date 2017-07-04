import { GameMap } from "./gameMap";
import { Wall } from "./wall";
import { Game } from "./game";
import { Point } from "./shape";
import { Character } from "./character";

export class Enemy extends Character {
    angle: number = 0;
    territoryPin: Point;
    territoryRange: number;
    constructor(public game: Game, idx) {
        super(game);
    }
    update() {
        if (this.game.frame % 50 == 0) {
            this.walk();
        }
    }
    draw(render: PIXI.Graphics) {
        render
            .beginFill(0x00ff00)
            .drawRect(this.pos.x * this.game.map.cellSize, this.pos.y * this.game.map.cellSize, this.game.map.cellSize, this.game.map.cellSize);
    }
}