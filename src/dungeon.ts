import "pixi.js";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
import { GameMap } from "./gameMap";
import { PathWay } from "./pathway";
import { Cell } from "./cell";
import { Game } from "./game";
import { wall } from "./wall";

export class Dungeon extends GameMap {
    constructor(public game:Game, public grid:Cell[][], public roomList: Room[], public pathWay: PathWay[]) {
        super(game, grid);
    }
}