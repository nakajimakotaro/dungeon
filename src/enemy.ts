import { Dungeon } from "./dungeon";
import { Wall } from "./wall";
import { Game } from "./game";
import { Point } from "./shape";

export class Enemy {
    pos: Point;
    angle:number = 0;
    constructor(public game: Game) {
        this.pos = new Point(this.game.dungeon.roomList[1].centerX, this.game.dungeon.roomList[1].centerY);
        this.trun("BACK");
    }
    update() {
        if (this.game.frame % 10 == 0) {
            this.walk();
        }
    }
    draw(render: PIXI.Graphics) {
        render
            .beginFill(0xff0000)
            .drawRect(this.pos.x * this.game.dungeon.cellSize, this.pos.y * this.game.dungeon.cellSize, this.game.dungeon.cellSize, this.game.dungeon.cellSize);
    }
    walk() {
        this.move(this.angle);
        if(!this.canMove(tish.angle)){
            return false;
        }else if(!this.canMove(tish.angle)){
        }else if(!this.canMove(tish.angle)){
        }else if(!this.canMove(tish.angle)){
        }
    }
    canMove(angle: number): boolean {
        let x = Math.cos(angle);
        let y = Math.sin(angle) * -1;
        if (!this.game.dungeon.isGridRange(this.pos.x + x, this.pos.y + y)) {
            return false;
        }
        if (this.game.dungeon.grid[this.pos.x + x][this.pos.y + y].belong instanceof Wall) {
            return false;
        }
        return true;
    }
    move(angle:number): boolean {
        if(!this.canMove(angle)){
            return false;
        }
        let x = Math.cos(angle);
        let y = Math.sin(angle) * -1;
        this.game.dungeon.grid[this.pos.x][this.pos.y].chara = null;
        this.pos.x += x;
        this.pos.y += y;
        this.game.dungeon.grid[this.pos.x][this.pos.y].chara = this;
        return true;
    }
    trun(nowAngle: ssdirection: "LEFT" | "RIGHT" | "BACK") {
        switch (direction) {
            case "LEFT":
                this.angle += Math.PI / 2;
                break;
            case "RIGHT":
                this.angle -= Math.PI / 2;
                break;
            case "BACK":
                this.angle += Math.PI;
                break;
        }
    }
}