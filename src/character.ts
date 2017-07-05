import { Game } from "./game";
import { Cell } from "./cell";
import { Wall } from "./wall";
import { Point } from "./shape";
import { AI} from "./ai";

export class Character {
    hp: number;
    pos: Point;
    angle: number;
    ai:AI|null;
    color:number;
    constructor(public game: Game) {
    }
    update(){
        if(this.ai && this.pos && this.angle != undefined){
            this.ai.update();
        }
    }
    addMap(x, y, angle) {
        this.pos = new Point(x, y);
        this.angle = angle;
    }
    draw(render: PIXI.Graphics) {
        render
            .beginFill(this.color)
            .drawRect(this.pos.x * this.game.map.cellSize, this.pos.y * this.game.map.cellSize, this.game.map.cellSize, this.game.map.cellSize);
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
    globalAngle(angle: number = 0) {
        let globalAngle = this.angle + angle;
        return this.normalizeAngle(globalAngle);
    }
    normalizeAngle(angle: number) {
        let normalizeAngle: number = angle;
        while (!(0 <= normalizeAngle && normalizeAngle < Math.PI * 2)) {
            if (normalizeAngle < 0) {
                normalizeAngle += Math.PI * 2;
            } else {
                normalizeAngle -= Math.PI * 2;
            }
        }
        return normalizeAngle;
    }
    matchAngleLineUp(angle: number): number {
        let normalizeAngle = this.normalizeAngle(angle);
        const direction = Math.min(
            Math.abs(normalizeAngle),
            Math.abs(normalizeAngle - Math.PI / 2),
            Math.abs(normalizeAngle - Math.PI),
            Math.abs(normalizeAngle - (Math.PI + Math.PI / 2)));
        if (Math.abs(normalizeAngle) == direction) {
            normalizeAngle = 0;
        } else if (Math.abs(normalizeAngle - Math.PI / 2) == direction) {
            normalizeAngle = Math.PI / 2;
        } else if (Math.abs(normalizeAngle - Math.PI) == direction) {
            normalizeAngle = Math.PI;
        } else if (Math.abs(normalizeAngle - (Math.PI + Math.PI / 2)) == direction) {
            normalizeAngle = Math.PI + Math.PI / 2;
        } else {
            throw new Error("Error");
        }
        return normalizeAngle;
    }
}