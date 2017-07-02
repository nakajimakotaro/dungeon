import { Point } from "./shape";
import { MysteryDungeon } from "./mysteryDungeon";
import { Cell } from "./cell";
export class Room {
    get grid() {
        return this.getAreaGrid(this.startX, this.startY, this.width, this.height);
    }
    get pos() {
        //return new Point(this.centerX * this.dungeon.cellSize, this.centerY * this.dungeon.cellSize);
        return new Point(this.centerX, this.centerY);
    }
    get centerX() {
        return this.startX + Math.floor(this.width / 2);
    }
    get centerY() {
        return this.startY + Math.floor(this.height / 2);
    }
    constructor(protected dungeon: MysteryDungeon, public startX: number, public startY: number, public width: number, public height: number) {
    }
    setGrid() {
        for (let yGrid of this.grid) {
            for (let cell of yGrid) {
                cell.belong = this;
                cell.color = 0x3399cc;
            }
        }
    }
    move(x: number, y: number) {
        this.startX = this.startX + x;
        this.startY = this.startX + y;
    }
    getAreaGrid(startX: number, startY: number, width: number, height: number): Cell[][] {
        let resultGrid = this.dungeon.grid.slice(startX, startX + width);
        for (let i = 0; i < resultGrid.length; i++) {
            const yGrid = resultGrid[i];
            resultGrid[i] = yGrid.slice(startY, startY + height);
        }
        return resultGrid;
    }
}