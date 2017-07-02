import "pixi.js";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
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
type RoomCreateConfig = {
    minWidthNum: number,
    minHeightNum: number,
    maxWidthNum: number,
    maxHeightNum: number,
    maxRangeNumX: number,
    maxRangeNumY: number,
    cellSize: number,
    volume: number, //作成する数
}

export class MysteryDungeon extends Dungeon {
    cellSize:number;
    constructor(public game: Game) {
        super(game);
        this.cellSize = 10;
        const roomCreateConfig = {
            minWidthNum: 4,
            minHeightNum: 4,
            maxWidthNum: 10,
            maxHeightNum: 10,
            maxRangeNumX: 60,
            maxRangeNumY: 60,
            cellSize: 10,
            volume: 10, //作成する数
        }
        this.grid = range(roomCreateConfig.maxRangeNumX).map((e, x) => range(roomCreateConfig.maxRangeNumY).map((e, y) =>
            new Cell(
                x,
                y,
                roomCreateConfig.cellSize,
                wall,
            )));
        this.roomList = this.generateRoom(roomCreateConfig);
        this.pathWay = this.generatePathWay(this.roomList);
    }
    generateRoom(roomCreateConfig:RoomCreateConfig) {
        let roomList = this.createRoomList(roomCreateConfig);
        this.adjustRoom(roomCreateConfig, roomList);
        roomList.forEach(e => e.setGrid());
        return roomList;
    }
    //かぶっている部屋をずらす
    adjustRoom(config: RoomCreateConfig, roomList: Room[]) {
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
        let collisionFlag = false;
        do {
            collisionFlag = false;
            for (let x = 0; x < roomList.length; x++) {
                for (let y = x + 1; y < roomList.length; y++) {
                    let a = roomList[x];
                    let b = roomList[y];
                    let rect = collitionRect(a, b);
                    if (rect.h > 0 && rect.w > 0) {
                        collisionFlag = true;
                        a.startX = rangeRandomInt(0, config.maxRangeNumX - a.width);
                        a.startY = rangeRandomInt(0, config.maxRangeNumY - a.height);
                    }
                }
            }
        } while (collisionFlag);
    }
    createRoom(config: RoomCreateConfig): Room {
        const widthNum = rangeRandomInt(config.minWidthNum, config.maxWidthNum);
        const heightNum = rangeRandomInt(config.minHeightNum, config.maxHeightNum);
        const startX = rangeRandomInt(0, config.maxRangeNumX - widthNum);
        const startY = rangeRandomInt(0, config.maxRangeNumY - heightNum);
        return new Room(
            this,
            startX,
            startY,
            widthNum,
            heightNum,
        );
    }


    createRoomList(config: RoomCreateConfig): Room[] {
        let list: Room[] = [];
        for (let count of range(config.volume)) {
            list.push(this.createRoom(config));
        }
        return list;
    }
    generatePathWay(roomList:Room[]){
        const nearAllPathWay = this.nearConnect(roomList);
        const minimumPathWay = this.minimumSpanningList(nearAllPathWay);
        minimumPathWay.forEach(e => e.setGrid());
        return minimumPathWay;
    }
    //近い部屋同士をつなげる
    //ドロネー三角形分割している
    nearConnect(roomList: Room[]) {
        type DelaunayNode = {
            triangle: Triangle,
            room1?: Room;
            room2?: Room;
            room3?: Room;
        }
        //分割した三角形
        const delaunayNodeMap = new Map<string, DelaunayNode>();
        //最初のすべてを含む三角形
        const hugaTriangle = Triangle.createIncludeRect(new Point(0, 0), new Point(this.grid.length, this.grid[0].length));
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

        const roomPairList: PathWay[] = [];
        for (let delaunayNode of delaunayNodeMap.values()) {
            if (delaunayNode.room1 == null || delaunayNode.room2 == null || delaunayNode.room3 == null) {
                throw new Error();
            }
            const roomPair1 = new PathWay(this, delaunayNode.room1, delaunayNode.room2)
            roomPairList.push(roomPair1);

            const roomPair2 = new PathWay(this, delaunayNode.room2, delaunayNode.room3)
            roomPairList.push(roomPair2);

            const roomPair3 = new PathWay(this, delaunayNode.room3, delaunayNode.room1)
            roomPairList.push(roomPair3);
        }
        return roomPairList;
    }
    minimumSpanningList(edgeList: PathWay[]): PathWay[] {
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