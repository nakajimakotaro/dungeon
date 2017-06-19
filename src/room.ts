import { Point } from "./shape";
import { PathWay, Cell, MysteryDungeon} from "./mysteryDungeon";
export class Room {
    grid:Cell[][];
    constructor(protected dungeon: MysteryDungeon, public startX:number, public startY:number, public width:number, public height:number, public pos: Point) {
        this.grid = this.getAreaGrid(startX, startY, width, height);
        for(let yGrid of this.grid){
            for(let cell of yGrid){
                cell.belong = this;
                cell.color = 0x3399cc;
            }
        }
    }
    get centerX(){
        return this.startX + Math.floor(this.width / 2) + this.width % 2;
    }
    get centerY(){
        return this.startY + Math.floor(this.height / 2) + this.height % 2;
    }
    getAreaGrid(startX: number, startY: number, width: number, height: number):Cell[][]{
        let resultGrid = this.dungeon.grid.slice(startX, startX + width);
        for (let i = 0; i < resultGrid.length; i++) {
            const yGrid = resultGrid[i];
            resultGrid[i] = yGrid.slice(startY, startY + height);
        }
        return resultGrid;
    }
}