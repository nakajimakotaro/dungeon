import "pixi.js";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
import { GameMap } from "./gameMap";
import { Dungeon } from "./dungeon";
import { PathWay } from "./pathway";
import { Cell } from "./cell";
import { Game } from "./game";
import { wall } from "./wall";

function rangeRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
function rangeRandomInt(min: number, max: number): number {
    return Math.floor(rangeRandom(min, max));
}
function range(range: number) {
    return new Array(range).fill(0).map((e, i) => i);
}
type RoomGenerateParameter = {
    minWidth: number,
    minHeight: number,
    maxWidth: number,
    maxHeight: number,
    volume: number, //作成する数
}
type CharacterGenerateParameter = {
}
type MysteryDungeonParameter = {
    room: RoomGenerateParameter,
    character: CharacterGenerateParameter,
    cellSize: number,
    rangeX: number,
    rangeY: number,
}

export class DungeonGenerator {
    static generate(game: Game, parameter: MysteryDungeonParameter) {
        const room: RoomGenerateParameter = {
            minWidth: 4,
            minHeight: 4,
            maxWidth: 10,
            maxHeight: 10,
            volume: 10, //作成する数
        };
        const character: CharacterGenerateParameter = {

        }
        const mysteryDungeonParameter: MysteryDungeonParameter = {
            room,
            character,
            cellSize: 10,
            rangeX: 10,
            rangeY: 10,
        }
        let maxRangeX = 60;
        let maxRangeY = 60;
        let cellSize = 10;
        const grid = range(maxRangeX).map((e, x) => range(maxRangeY).map((e, y) =>
            new Cell(
                x,
                y,
                cellSize,
                wall,
            )));
        const roomList = DungeonGenerator.generateRoom(mysteryDungeonParameter);
        const pathWay = DungeonGenerator.generatePathWay(mysteryDungeonParameter, roomList);
        const dungeon = new Dungeon(game, grid, roomList, pathWay);
    }
    private static generateRoom(mysteryDungeonParameter: MysteryDungeonParameter) {
        let roomList = this.createRoomList(mysteryDungeonParameter);
        this.adjustRoom(mysteryDungeonParameter, roomList);
        roomList.forEach(e => e.setGrid());
        return roomList;
    }
    //かぶっている部屋をずらす
    private static adjustRoom(parameter: MysteryDungeonParameter, roomList: Room[]) {
        function collitionRect(a: Room, b: Room) {
            let collisionRect = { x: 0, y: 0, w: 0, h: 0 };
            collisionRect.x = Math.max(a.startX, b.startX);
            collisionRect.y = Math.max(a.startY, b.startY);

            let tempA: Room;
            let tempB: Room;
            if (collisionRect.x == a.startX) {
                tempA = a;
                tempB = b;
            } else {
                tempA = b;
                tempB = a;
            }
            collisionRect.w = (tempB.startX + tempB.width) - tempA.startX;

            if (collisionRect.y == a.startY) {
                tempA = a;
                tempB = b;
            } else {
                tempA = b;
                tempB = a;
            }
            collisionRect.h = (tempB.startY + tempB.height) - tempA.startY;
            return collisionRect;
        }
        let collisionFlag: boolean;
        do {
            collisionFlag = false;
            for (let x = 0; x < roomList.length; x++) {
                for (let y = x + 1; y < roomList.length; y++) {
                    let a = roomList[x];
                    let b = roomList[y];
                    let rect = collitionRect(a, b);
                    if (rect.h > 0 && rect.w > 0) {
                        collisionFlag = true;
                        a.startX = rangeRandomInt(0, parameter.rangeX - a.width);
                        a.startY = rangeRandomInt(0, parameter.rangeY - a.height);
                    }
                }
            }
        } while (collisionFlag);
    }
    private static createRoom(parameter: MysteryDungeonParameter): Room {
        const width = rangeRandomInt(parameter.room.minWidth, parameter.room.maxWidth);
        const height = rangeRandomInt(parameter.room.minHeight, parameter.room.maxHeight);
        const startX = rangeRandomInt(0, parameter.rangeX - width);
        const startY = rangeRandomInt(0, parameter.rangeY - height);
        return new Room(
            this,
            startX,
            startY,
            width,
            height,
        );
    }


    private static createRoomList(parameter: MysteryDungeonParameter): Room[] {
        let list: Room[] = [];
        for (let count of range(parameter.room.volume)) {
            list.push(DungeonGenerator.createRoom(parameter));
        }
        return list;
    }
    private static generatePathWay(parameter: MysteryDungeonParameter, dungeon, roomList: Room[]) {
        const nearAllPathWay = DungeonGenerator.createPathWay(dungeon, DungeonGenerator.nearRoomTriangleList(parameter, roomList));
        const minimumPathWay = DungeonGenerator.minimumSpanningList(nearAllPathWay);
        minimumPathWay.forEach(e => e.setGrid());
        return minimumPathWay;
    }
    private static createPathWay(dungeon:Dungeon, nearRoomTriangleList: { room1: Room, room2: Room, room3: Room }[])PathWay[]{
        const roomPairList: PathWay[] = [];
        for (let nearRoomTriangle of nearRoomTriangleList) {
            const roomPair1 = new PathWay(dungeon, nearRoomTriangle.room1, nearRoomTriangle.room2)
            roomPairList.push(roomPair1);

            const roomPair2 = new PathWay(dungeon, nearRoomTriangle.room2, nearRoomTriangle.room3)
            roomPairList.push(roomPair2);

            const roomPair3 = new PathWay(dungeon, nearRoomTriangle.room3, nearRoomTriangle.room1)
            roomPairList.push(roomPair3);
        }
        return roomPairList;
    }
    //近い部屋同士をつなげる
    //ドロネー三角形分割している
    private static nearRoomTriangleList(parameter: MysteryDungeonParameter, roomList: Room[]): { room1: Room, room2: Room, room3: Room }[] {
        type DelaunayNode = {
            triangle: Triangle,
            room1?: Room;
            room2?: Room;
            room3?: Room;
        }
        //分割した三角形
        const delaunayNodeMap = new Map<string, DelaunayNode>();
        //最初のすべてを含む三角形
        const hugaTriangle = Triangle.createIncludeRect(new Point(0, 0), new Point(parameter.rangeX, parameter.rangeY));
        delaunayNodeMap.set(hugaTriangle.toString(), { triangle: hugaTriangle });

        for (let room of roomList) {
            //追加候補の三角形を保持するハッシュ
            //booleanがtrueなら重複はない
            const tmpDelaunayNodeMap = new Map<string, { node: DelaunayNode, bool: boolean }>();
            for (let node of delaunayNodeMap.values()) {
                //外接円を取得して
                const circle = node.triangle.getCircumscribedCircle();
                //外接円の中に点があれば
                if (circle.contains(room.pos)) {
                    //tmpTriangleMapに追加する
                    //重複する三角形ならboolをfalseにする
                    function tmpSet(node: DelaunayNode) {
                        if (tmpDelaunayNodeMap.has(node.triangle.toString())) {
                            tmpDelaunayNodeMap.set(node.triangle.toString(), { node: node, bool: false });
                        } else {
                            tmpDelaunayNodeMap.set(node.triangle.toString(), { node: node, bool: true });
                        }
                    }
                    //その三角形を削除し新たに分割しなおす
                    tmpSet({
                        triangle: new Triangle(room.pos, node.triangle.p1, node.triangle.p2),
                        room1: room,
                        room2: node.room1,
                        room3: node.room2,
                    });
                    tmpSet({
                        triangle: new Triangle(room.pos, node.triangle.p2, node.triangle.p3),
                        room1: room,
                        room2: node.room2,
                        room3: node.room3,
                    });
                    tmpSet({
                        triangle: new Triangle(room.pos, node.triangle.p3, node.triangle.p1),
                        room1: room,
                        room2: node.room3,
                        room3: node.room1,
                    });
                    delaunayNodeMap.delete(node.triangle.toString());
                }
            }
            //三角形を追加
            for (let tmpDelaunyNode of tmpDelaunayNodeMap.values()) {
                //重複を除く
                if (tmpDelaunyNode.bool) {
                    delaunayNodeMap.set(tmpDelaunyNode.node.triangle.toString(), tmpDelaunyNode.node);
                }
            }
        }
        //最初の三角形を頂点に持っている三角形を削除
        //この時点でdelaunayNodeのNullは消えている
        for (let delaunayNode of delaunayNodeMap.values()) {
            if (
                delaunayNode.room1 == null ||
                delaunayNode.room2 == null ||
                delaunayNode.room3 == null
            ) {
                delaunayNodeMap.delete(delaunayNode.triangle.toString());
            }
        }
        const nearRoomTriangleList: { room1: Room, room2: Room, room3: Room }[] = [];
        for (let delaunayNode of delaunayNodeMap.values()) {
            if (delaunayNode.room1 == null || delaunayNode.room2 == null || delaunayNode.room3 == null) {
                throw new Error();
            }
            nearRoomTriangleList.push({
                room1: delaunayNode.room1,
                room2: delaunayNode.room2,
                room3: delaunayNode.room3,
            });
        }
        return nearRoomTriangleList;
    }
    private static minimumSpanningList(edgeList: PathWay[]): PathWay[] {
        class DisjointSet<T> {
            node: T;
            childList: DisjointSet<T>[] = [];
            parent: DisjointSet<T> | null = null;

            addChild(child: DisjointSet<T>) {
                this.childList.push(child);
                child.parent = this;
            }

            constructor(node: T, parent: DisjointSet<T> | null = null) {
                this.node = node;
                this.parent = parent;
            }

            uniton(tree: DisjointSet<T>): boolean {
                if (this.same(tree)) {
                    return false;
                }
                this.getTop().addChild(tree.getTop());
                return true;
            }
            getTop(): DisjointSet<T> {
                if (this.parent) {
                    const top = this.parent.getTop();
                    this.parent = top;
                    return top;
                }
                return this;
            }
            same(tree: DisjointSet<T>): boolean {
                return this.getTop() == tree.getTop();
            }
        }
        const sortedEdgeList = edgeList.slice().sort((a, b) => a.range - b.range);
        const edgeDisjointSet: Map<Room, DisjointSet<Room>> = new Map();
        for (let edge of sortedEdgeList) {
            //効率悪い
            edgeDisjointSet.set(edge.pair1, new DisjointSet(edge.pair1));
            edgeDisjointSet.set(edge.pair2, new DisjointSet(edge.pair2));
        }

        const minimunSpanningEdgeList: PathWay[] = [];
        for (let edge of sortedEdgeList) {
            const node1 = edgeDisjointSet.get(edge.pair1);
            const node2 = edgeDisjointSet.get(edge.pair2);
            if (!(node1 && node2)) {
                throw new Error();
            }
            if (!node1.same(node2)) {
                minimunSpanningEdgeList.push(edge);
                node1.uniton(node2);
            }
        }
        return minimunSpanningEdgeList;
    }
}