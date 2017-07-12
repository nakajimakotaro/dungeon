import "pixi.js";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
import { GameMap } from "./gameMap";
import { PathWay } from "./pathway";
import { Cell } from "./cell";
import { Game } from "./game";
import { wall } from "./wall";

export class Dungeon extends GameMap {
    roomList:Room[];
    pathWayList: PathWay[];
    constructor(public game: Game, public grid: Cell[][]) {
        super(game, grid);
    }

    setRoom(roomList:Room[]){
        for(let room of roomList){
            room.dungeon = this;
        }
        this.roomList = roomList;
    }
    setPathWay(connectRoomList: { room1: Room, room2: Room }[]){
        this.pathWayList = [];
        for (let connectRoom of connectRoomList) {
            this.pathWayList.push(new PathWay(this, connectRoom.room1, connectRoom.room2));
        }
    }
    setGrid(){
        for (let room of this.roomList) {
            room.setGrid();
        }
        for (let pathway of this.pathWayList) {
            pathway.setGrid();
        }
    }
}