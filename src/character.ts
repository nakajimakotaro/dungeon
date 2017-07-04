import { Game } from "./game";
import { Cell } from "./cell";
import { Wall } from "./wall";
import { Point } from "./shape";

export abstract class Character {
    hp:number;
    pos: Point;
    angle:number;
    constructor(public game: Game) {
    }
    addMap(x, y, angle){
        this.pos = new Point(x, y);
        this.angle = angle;
    }
    canMoveTo(x: number, y: number): boolean {
        if (!this.game.map.isGridRange(x, y)) {
            return false;
        }
        if (this.game.map.grid[x][y].belong instanceof Wall) {
            return false;
        }
        if (this.game.map.grid[x][y].chara != null) {
            return false;
        }
        return true;
    }
    move(angle: number): boolean {
        const x = Math.round(Math.cos(angle));
        const y = Math.round(Math.sin(angle)) * -1;
        if (!this.canMoveTo(this.pos.x + x, this.pos.y + y)) {
            return false;
        }
        this.game.map.grid[this.pos.x][this.pos.y].chara = null;
        this.pos.x += x;
        this.pos.y += y;
        this.game.map.grid[this.pos.x][this.pos.y].chara = this;
        return true;
    }
    trun(angle: number) {
        let globalAngle = this.angle + angle;
        while (!(0 <= globalAngle && globalAngle < Math.PI * 2)) {
            if (globalAngle < 0) {
                globalAngle += Math.PI * 2;
            } else {
                globalAngle -= Math.PI * 2;
            }
        }
        if (Math.abs(globalAngle) < 0.1) {
            globalAngle = 0;
        } else if (Math.abs(globalAngle) - Math.PI / 2 < 0.1) {
            globalAngle = Math.PI / 2;
        } else if (Math.abs(globalAngle) - Math.PI < 0.1) {
            globalAngle = Math.PI;
        } else if (Math.abs(globalAngle) - (Math.PI + Math.PI / 2) < 0.1) {
            globalAngle = Math.PI + Math.PI / 2;
        }
        return globalAngle;
    }
}