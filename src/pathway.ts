import "pixi.js";
import { Wall } from "./wall";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
import { GameMap } from "./gameMap";
import { Cell } from "./cell";
import { Game } from "./game";

class Edge<T>{
    parentTree: Edge<T> | null;
    constructor(public pair1: T, public pair2: T, public range: number) {
    }
}

export class PathWay extends Edge<Room> {
    grid: Cell[][];
    constructor(private dungeon: GameMap, pair1: Room, pair2: Room) {
        super(pair1, pair2, Math.hypot(pair1.pos.x - pair2.pos.x, pair1.pos.y - pair2.pos.y));
    }

    setGrid() {
        function selectDirection(room1: Room, room2: Room, x: number, y: number): "right" | "left" | "up" | "down" {
            const xRange = Math.abs(x - room2.centerX); //x軸の距離
            const yRange = Math.abs(y - room2.centerY); //y軸の距離
            if (xRange > yRange) {
                if (x < room2.centerX) {
                    return "right";
                } else {
                    return "left";
                }
            } else {
                if (y < room2.centerY) {
                    return "down";
                } else {
                    return "up";
                }
            }
        }
        function createWay(dungeon: GameMap, pathWay: PathWay, room1: Room, room2: Room, x: number = room1.centerX, y: number = room1.centerY) {
            const direction = selectDirection(room1, room2, x, y);
            while (true) {
                if (dungeon.grid[x][y].belong instanceof Wall) {
                    dungeon.grid[x][y].belong = pathWay;
                    dungeon.grid[x][y].color = 0x009944;
                }
                switch (direction) {
                    case "left":
                        x--;
                        break;
                    case "right":
                        x++;
                        break;
                    case "up":
                        y--;
                        break;
                    case "down":
                        y++;
                        break;
                }

                if (dungeon.grid[x][y].belong == room2) {
                    //接続完了
                    break;
                }
                if (
                    (direction == "left" || direction == "right") && x == room2.centerX ||
                    (direction == "down" || direction == "up") && y == room2.centerY) {
                    //折れ曲がる
                    createWay(dungeon, pathWay, room1, room2, x, y);
                    break;
                }
            }
        }
        createWay(this.dungeon, this, this.pair1, this.pair2);
    }
}