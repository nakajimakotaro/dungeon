import "pixi.js";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";

type RoomCreateConfig = {
    minWidthNum: number,
    minHeightNum: number,
    maxWidthNum: number,
    maxHeightNum: number,
    maxRangeNumX: number,
    maxRangeNumY: number,
    gridSize: number,
    volume: number, //作成する数
}
export class Item {

}
export class Character {
}
export class Cell {
    constructor(
        public x: number,
        public y: number,
        public gridSize: number,
        public belong: Room | PathWay | Wall,
        public items: Item[] = [],
        public chara: Character | null = null,
        public color: number = 0) {
    }
}

class Edge<T>{
    parentTree: Edge<T> | null;
    constructor(public pair1: T, public pair2: T, public range: number) {
    }
}
export class PathWay extends Edge<Room> {
    grid: Cell[][];
    constructor(private dungeon: MysteryDungeon, pair1: Room, pair2: Room) {
        super(pair1, pair2, Math.hypot(pair1.pos.x - pair2.pos.x, pair1.pos.y - pair2.pos.y));
        this.pairConnect();
    }

    pairConnect() {
        function selectDirection(room1: Room, room2: Room, x: number, y: number): "right" | "left" | "up" | "down" {
            const xRange = Math.abs(x - room2.centerX); //x軸の距離
            const yRange = Math.abs(y - room2.centerY); //y軸の距離
            if (xRange > yRange) {
                if (x < room2.startX) {
                    return "right";
                } else {
                    return "left";
                }
            } else {
                if (y < room2.startY) {
                    return "down";
                } else {
                    return "up";
                }
            }
        }
        function createWay(dungeon: MysteryDungeon, pathWay: PathWay, room1: Room, room2: Room, x: number = room1.centerX, y: number = room1.centerY) {
            const direction = selectDirection(room1, room2, x, y);
            while (true) {
                if (
                    (direction == "left" || direction == "right") && x == room2.centerX ||
                    (direction == "down" || direction == "up") && y == room2.centerY) {
                    //折れ曲がる
                    createWay(dungeon, pathWay, room1, room2, x, y);
                    break;
                }
                if (dungeon.grid[x][y].belong == room2) {
                    //接続完了
                    break;
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
                //console.log(dungeon.grid[x][y].belong)
                if (dungeon.grid[x][y].belong instanceof Wall) {
                    dungeon.grid[x][y].belong = pathWay;
                    dungeon.grid[x][y].color = 0x009944;
                }
            }
        }
        createWay(this.dungeon, this, this.pair1, this.pair2);
    }
}


function rangeRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
function rangeRandomInt(min: number, max: number): number {
    return Math.floor(rangeRandom(min, max));
}
function range(range: number) {
    return new Array(range).fill(0).map((e, i) => i);
}
function floorGridSize(size: number, gridSize: number) {
    return Math.floor(size / gridSize);
}

class Wall {

}
const wall = new Wall();

export class MysteryDungeon {
    roomList: Room[];
    pathWay: PathWay[];
    grid: Cell[][];
    constructor() {
        const roomCreateConfig = {
            minWidthNum: 4,
            minHeightNum: 4,
            maxWidthNum: 10,
            maxHeightNum: 10,
            maxRangeNumX: 60,
            maxRangeNumY: 60,
            gridSize: 10,
            volume: 3, //作成する数
        }
        this.grid = range(roomCreateConfig.maxRangeNumX).map((e, x) => range(roomCreateConfig.maxRangeNumY).map((e, y) =>
            new Cell(
                x,
                y,
                roomCreateConfig.gridSize,
                wall,
            )));
        this.roomList = RoomOperator.createRoomList(this, roomCreateConfig);
        const roomAllPath = RoomOperator.connectRoom(this, this.roomList);
        const roomMinimumPath = RoomOperator.minimumSpanningList(roomAllPath);
        this.pathWay = roomMinimumPath;
    }
    draw(render: PIXI.Graphics) {
        for (let yGrid of this.grid) {
            for (let cell of yGrid) {
                render
                    .beginFill(cell.color)
                    .drawRect(cell.x * cell.gridSize, cell.y * cell.gridSize, cell.gridSize, cell.gridSize);
            }
        }
        //for (let room of this.roomList) {
        //    room.draw(render);
        //}
        //for (let pair of this.pathWay) {
        //    render
        //        .endFill()
        //        .lineStyle(1, 0xff00ff)
        //        .moveTo(pair.pair1.pos.x, pair.pair1.pos.y)
        //        .lineTo(pair.pair2.pos.x, pair.pair2.pos.y);
        //}
    }
}
class RoomOperator {
    static generate2DGred(roomList: Room[], pathWay: PathWay, widthNum: number, heightNum: number, gridSize: number) {
        for (let room of roomList) {
        }
        return;
    }
    static createRoomList(dungeon: MysteryDungeon, config: RoomCreateConfig): Room[] {
        let list: Room[] = [];
        for (let count of range(config.volume)) {
            const widthNum = rangeRandomInt(config.minWidthNum, config.maxWidthNum);
            const heightNum = rangeRandomInt(config.minHeightNum, config.maxHeightNum);
            const startX = rangeRandomInt(0, config.maxRangeNumX - widthNum);
            const startY = rangeRandomInt(0, config.maxRangeNumY - heightNum);
            list.push(new Room(
                dungeon,
                startX,
                startY,
                widthNum,
                heightNum,
                new Point(
                    startX * config.gridSize + widthNum * config.gridSize / 2,
                    startY * config.gridSize + heightNum * config.gridSize / 2,
                )
            ));
        }
        return list;
    }
    //いい感じに部屋同士をつなげる
    //ドロネー三角形分割している
    static connectRoom(dungeon: MysteryDungeon, roomList: Room[]) {
        type DelaunayNode = {
            triangle: Triangle,
            room1?: Room;
            room2?: Room;
            room3?: Room;
        }
        //分割した三角形
        const delaunayNodeMap = new Map<string, DelaunayNode>();
        //最初のすべてを含む三角形
        const hugaTriangle = Triangle.createIncludeRect(new Point(0, 0), new Point(600, 600));
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
            const roomPair1 = new PathWay(dungeon, delaunayNode.room1, delaunayNode.room2)
            roomPairList.push(roomPair1);

            const roomPair2 = new PathWay(dungeon, delaunayNode.room2, delaunayNode.room3)
            roomPairList.push(roomPair2);

            const roomPair3 = new PathWay(dungeon, delaunayNode.room3, delaunayNode.room1)
            roomPairList.push(roomPair3);
        }
        return roomPairList;
    }
    static minimumSpanningList(edgeList: PathWay[]): PathWay[] {
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