import "pixi.js";
import { Game } from "./game";
import { Room } from "./room";
import { Cell } from "./cell";
import { PathWay } from "./pathway";
import { Wall } from "./wall";

export abstract class Dungeon {
    roomList: Room[];
    pathWay: PathWay[];
    grid: Cell[][];
    gridSize: number;
    constructor(public game:Game) {
    }
    draw(render: PIXI.Graphics) {
        for (let yGrid of this.grid) {
            for (let cell of yGrid) {
                cell.draw(render);
            }
        }
    }
    isGridRange(x:number, y:number){
        return x >= 0 && y >= 0 && x < this.grid.length && y < this.grid[0].length;
    }
}