import { Point } from "./shape";
import { PathWay, Cell, MysteryDungeon } from "./mysteryDungeon";
export class Room {
    constructor(protected dungeon: MysteryDungeon, public grid: Cell[][], public pos: Point) {
        dungeon.grid.slice()
    }
    draw(render: PIXI.Graphics, lineDraw: boolean = false) {
        console.log(this.pos)
        for (let yGrid of this.grid) {
            for (let cell of yGrid) {
                render
                    .beginFill(0x3399cc)
                    .drawRect(cell.x * cell.gridSize, cell.y * cell.gridSize, cell.gridSize, cell.gridSize);
            }
        }
    }
}