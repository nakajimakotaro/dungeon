import { MysteryDungeon } from "./mysteryDungeon";
import { Wall } from "./wall";
import {Game} from "./game";
import { Point } from "./shape";

export class Player {
    pos: Point;
    constructor(public game:Game) {
        this.pos = new Point(this.game.dungeon.roomList[0].centerX, this.game.dungeon.roomList[0].centerY);
        document.addEventListener("keydown", (e) => {
        });
    }
    update() {
        if(this.game.frame % 5 == 0){
            this.walk();
        }
    }
    draw(render: PIXI.Graphics) {
        render
            .beginFill(0xff0000)
            .drawRect(this.pos.x * this.game.dungeon.cellSize, this.pos.y * this.game.dungeon.cellSize, this.game.dungeon.cellSize, this.game.dungeon.cellSize);
    }
    walk(){
            const W = 87;
            const A = 65;
            const S = 83;
            const D = 68;
            let direction:"left" | "right" | "up" | "down"|"none" = "none";
            if(this.game.inputManager.getKeyStatus("w") == "push"){
                direction = "up";
            }
            if(this.game.inputManager.getKeyStatus("a") == "push"){
                direction = "left";
            }
            if(this.game.inputManager.getKeyStatus("s") == "push"){
                direction = "down";
            }
            if(this.game.inputManager.getKeyStatus("d") == "push"){
                direction = "right";
            }
            if(direction != "none"){
                this.move(direction);
            }
    }
    move(direction: "left" | "right" | "up" | "down"): boolean {
        let x = 0, y = 0;
        switch (direction) {
            case "left":
                x--;
                break;
            case "right":
                x++;
                break;
            case "up":
                y--;
                break;
            case "down":
                y++;
                break;
        }
        if (!this.game.dungeon.isGridRange(this.pos.x + x, this.pos.y + y)) {
            return false;
        }
        if (this.game.dungeon.grid[this.pos.x + x][this.pos.y + y].belong instanceof Wall) {
            return false;
        }
        this.game.dungeon.grid[this.pos.x][this.pos.y].chara = null;
        this.pos.x += x;
        this.pos.y += y;
        this.game.dungeon.grid[this.pos.x][this.pos.y].chara = this;
        return true;
    }
}
