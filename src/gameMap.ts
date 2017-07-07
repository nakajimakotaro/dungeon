import "pixi.js";
import { Game } from "./game";
import { Room } from "./room";
import { Character } from "./character";
import { Cell } from "./cell";
import { PathWay } from "./pathway";
import { Wall } from "./wall";

export abstract class GameMap {
    get gridSizeX(){
        return this.grid.length;
    }
    get gridSizeY(){
        return this.grid[0].length;
    }
    get cellSize(){
        return this.grid[0][0].size;
    }

    constructor(public game:Game, public grid:Cell[][]) {
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
    addChara(chara:Character){
    }
}