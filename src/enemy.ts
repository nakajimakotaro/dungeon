import { Dungeon } from "./dungeon";
import { Wall } from "./wall";
import { Game } from "./game";
import { Point } from "./shape";
import { Character } from "./character";

function rangeRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
function rangeRandomInt(min: number, max: number): number {
    return Math.floor(rangeRandom(min, max));
}
export class Enemy extends Character {
    angle: number = 0;
    territoryPin: Point;
    territoryRange: number;
    constructor(public game: Game, idx) {
        super(game);
        this.pos = new Point(this.game.dungeon.roomList[idx].centerX, this.game.dungeon.roomList[idx].centerY);
        this.territoryPin = new Point(this.game.dungeon.roomList[idx].centerX, this.game.dungeon.roomList[idx].centerY);
        this.territoryRange = 5;
    }
    update() {
        if (this.game.frame % 50 == 0) {
            this.walk();
        }
    }
    draw(render: PIXI.Graphics) {
        render
            .beginFill(0x00ff00)
            .drawRect(this.pos.x * this.game.dungeon.cellSize, this.pos.y * this.game.dungeon.cellSize, this.game.dungeon.cellSize, this.game.dungeon.cellSize);
    }
    walk() {
        const isInTerritory = (w: number, h: number) => {
            return Math.hypot(w, h) < this.territoryRange;
        }
        let tryAngle: number;
        //縄張りの中からはみ出さないようランダムに向きを決める
        do {
            tryAngle = this.trun([0, Math.PI / 2, Math.PI, Math.PI + Math.PI / 2][rangeRandomInt(0, 4)]);
        } while (
            !isInTerritory(
                this.pos.x + Math.round(Math.cos(tryAngle)) - this.territoryPin.x,
                this.pos.y + Math.round(Math.sin(tryAngle)) * -1 - this.territoryPin.y)
        );
        this.angle = tryAngle;
        this.move(this.angle);
    }
    canMove(angle: number): boolean {
        const x = Math.round(Math.cos(angle));
        const y = Math.round(Math.sin(angle)) * -1;
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
        const x = Math.round(Math.cos(angle));
        const y = Math.round(Math.sin(angle)) * -1;
        this.game.dungeon.grid[this.pos.x][this.pos.y].chara = null;
        this.pos.x += x;
        this.pos.y += y;
        this.game.dungeon.grid[this.pos.x][this.pos.y].chara = this;
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
    //使わない　隔離
    autoTrun() {
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
    }
}