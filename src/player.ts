import { Wall } from "./wall";
import { Game } from "./game";
import { Point } from "./shape";
import { Character } from "./character";

export class Player extends Character {
    constructor(public game: Game) {
        super(game);
        this.pos = new Point(this.game.map.roomList[0].centerX, this.game.map.roomList[0].centerY);
    }
    update() {
        if (this.game.frame % 5 == 0) {
            this.walk();
        }
    }
    draw(render: PIXI.Graphics) {
        render
            .beginFill(0xff0000)
            .drawRect(this.pos.x * this.game.map.cellSize, this.pos.y * this.game.map.cellSize, this.game.map.cellSize, this.game.map.cellSize);
    }
    walk() {
        const W = 87;
        const A = 65;
        const S = 83;
        const D = 68;
        let angle: number | null = null;
        if (this.game.inputManager.getKeyStatus("w") == "push") {
            angle = Math.PI / 2;
        }
        if (this.game.inputManager.getKeyStatus("a") == "push") {
            angle = Math.PI;
        }
        if (this.game.inputManager.getKeyStatus("s") == "push") {
            angle = Math.PI + Math.PI / 2;
        }
        if (this.game.inputManager.getKeyStatus("d") == "push") {
            angle = 0;
        }
        if (angle != null) {
            this.move(angle);
        }
    }
}
