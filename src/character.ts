import {Game} from "./game";
import {Cell} from "./cell";
import {Wall} from "./wall";
import {Point} from "./shape";

export abstract class Character{
    pos: Point;
    constructor(public game:Game){
    }
    canMoveTo(x:number, y:number):boolean{
        if(!this.game.dungeon.isGridRange(x, y)){
            return false;
        }
        if(this.game.dungeon.grid[x][y].belong == Wall){
            return false;
        }
        if(this.game.dungeon.grid[x][y].chara != null){
            return false;
        }
        return true;
    }
}