import { Dungeon } from "./dungeon";
import { Wall } from "./wall";
import { Game } from "./game";
import { Point } from "./shape";

export class Enemy {
    pos: Point;
    angle: number = 0;
    constructor(public game: Game, idx) {
        this.pos = new Point(this.game.dungeon.roomList[idx].centerX, this.game.dungeon.roomList[idx].centerY);
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
        if (!this.canMove(this.angle)) {
            this.trun();
        }
        this.move(this.angle);
    }
    canMove(angle: number): boolean {
        let x = Math.round(Math.cos(angle));
        let y = Math.round(Math.sin(angle)) * -1;
        if (!this.game.dungeon.isGridRange(this.pos.x + x, this.pos.y + y)) {
            return false;
        }
        if (this.game.dungeon.grid[this.pos.x + x][this.pos.y + y].belong instanceof Wall) {
            return false;
        }
        return true;
    }
    move(angle: number): boolean {
        if (!this.canMove(angle)) {
            return false;
        }
        let x = Math.round(Math.cos(angle));
        let y = Math.round(Math.sin(angle)) * -1;
        this.game.dungeon.grid[this.pos.x][this.pos.y].chara = null;
        this.pos.x += x;
        this.pos.y += y;
        this.game.dungeon.grid[this.pos.x][this.pos.y].chara = this;
        return true
    }
    trun() {
        let angle = 0;
        if (this.canMove(this.angle)) {
            angle = this.angle;
        } else if (this.canMove(this.angle + Math.PI / 2)) {
            angle = this.angle + Math.PI / 2;
        } else if (this.canMove(this.angle + Math.PI)) {
            angle = this.angle + Math.PI;
        } else if (this.canMove(this.angle + Math.PI + Math.PI / 2)) {
            angle = this.angle + Math.PI + Math.PI / 2;
        }
        while (!(0 <= angle && angle < Math.PI * 2)) {
            if (angle < 0) {
                angle += Math.PI * 2;
            } else {
                angle -= Math.PI * 2;
            }
        }
        if (Math.abs(angle) < 0.1) {
            this.angle = 0;
        } else if (Math.abs(angle) - Math.PI / 2 < 0.1) {
            this.angle = Math.PI / 2;
        } else if (Math.abs(angle) - Math.PI < 0.1) {
            this.angle = Math.PI;
        } else if (Math.abs(angle) - (Math.PI + Math.PI / 2) < 0.1) {
            this.angle = Math.PI + Math.PI / 2;
        }
    }
}