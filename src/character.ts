import { Game } from "./game";
import { Dungeon } from "./dungeon";
import { Cause } from "./cause";
import { Wall } from "./wall";
import { Point } from "./shape";
import { AI } from "./AI/AI";
import { NoneAI } from "./AI/NoneAI";
import { TurnManager, TurnInterface } from "./turnManager";
import { Animation, AnimationManager } from "./animation/animation";

export class Character implements TurnInterface {
    public ai: AI;
    public turnWaitTime: number = 10;
    public nextTurnTime: number = 0;
    animationManager: AnimationManager = new AnimationManager;
    public 
    public turnStart() {
        this.ai.turnStart();
    }
    public turnUpdate() {
        this.ai.turnUpdate();
    }
    constructor(public game: Game, dungeon: Dungeon, public hp: number, public pos: Point, public angle: number, public color: number, public group: string) {
        dungeon.grid[this.pos.x][this.pos.y].chara = this;
        dungeon.turnManager.addTurnListener(this);
        this.ai = new NoneAI(game, this);
    }
    update() {
        if (this.ai && this.pos && this.angle != undefined) {
            this.ai.update();
        }
        this.animationManager.update();
        if (this.hp < 0) {
            this.die();
        }
    }
    addMap(x, y, angle) {
        this.pos = new Point(x, y);
        this.angle = angle;
    }
    fireCause(cause: Cause) {
        this.hp -= cause.damege;
        this.hp += cause.heal;
    }
    draw(render: PIXI.Graphics) {
        render
            .beginFill(this.color)
            .drawRect(this.pos.x * this.game.gameMap.cellSize, this.pos.y * this.game.gameMap.cellSize, this.game.gameMap.cellSize, this.game.gameMap.cellSize);
    }
    canMoveTo(x: number, y: number): boolean {
        if (!this.game.gameMap.isGridRange(x, y)) {
            return false;
        }
        if (this.game.gameMap.grid[x][y].belong instanceof Wall) {
            return false;
        }
        if (this.game.gameMap.grid[x][y].chara != null) {
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
        this.game.gameMap.grid[this.pos.x][this.pos.y].chara = null;
        this.pos.x += x;
        this.pos.y += y;
        this.game.gameMap.grid[this.pos.x][this.pos.y].chara = this;
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
    frontOf() {
        const x = this.pos.x + Math.round(Math.cos(this.angle));
        const y = this.pos.y + Math.round(Math.sin(this.angle)) * -1;
        if (!this.game.gameMap.isGridRange(x, y)) {
            return null;
        }
        return this.game.gameMap.grid[x][y];
    }
    die() {
        this.game.gameMap.removeChara(this);
        this.game.gameMap.grid[this.pos.x][this.pos.y].chara = null;
    }
}