import "pixi.js";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";


function rangeRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
function range(range: number) {
    return new Array(range).fill(0).map((e, i) => i);
}
function roundGridSize(value: number, gridSize: number): number {
    return Math.round(value - value % gridSize);
}

class Edge<T>{
    parentTree: Tree<Edge<T>> | null;
    constructor(public pair1: T, public pair2: T, public range: number) {
    }
}
export class RoomPair extends Edge<Room> {
    constructor(pair1: Room, pair2: Room) {
        super(pair1, pair2, Math.hypot(pair1.pos.x - pair2.pos.x, pair1.pos.y - pair2.pos.y));
    }
}

export class MysteryDungeon {
    roomList: Room[];
    roomGraph: RoomPair[];
    roomTree: Tree<RoomPair>;
    constructor() {
        this.roomList = RoomOperator.createRoomList(40, 40, 600, 600, 4, 4);
        this.roomGraph = RoomOperator.connectRoom(this.roomList);
        this.roomTree = MinimumSpanningTree.create(this.roomGraph);
    }
}

class RoomOperator {
    static createRoomList(maxWidth: number, maxHeight: number, maxrangeX: number, maxrangeY: number, gridSize: number = 4, pos: number = 10): Room[] {
        let list: Room[] = [];
        for (let count of range(pos)) {
            let width = roundGridSize(rangeRandom(10, maxWidth), gridSize);
            let height = roundGridSize(rangeRandom(10, maxHeight), gridSize);
            list.push(new Room(
                new Point(
                    roundGridSize(rangeRandom(10, maxrangeX), gridSize) - width / 2,
                    roundGridSize(rangeRandom(10, maxrangeY), gridSize) - height / 2,
                ),
                width,
                height,
            ));
        }
        return list;
    }
    //いい感じに部屋同士をつなげる
    //ドロネー三角形分割している
    static connectRoom(roomList: Room[]) {
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
                        if (tmpDelaunayNodeMap.has(node.triangle.toString()) || delaunayNodeMap.has(node.triangle.toString())) {
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

        const roomPairList: RoomPair[] = [];
        for (let delaunayNode of delaunayNodeMap.values()) {
            const roomPair = new RoomPair(delaunayNode.room1!, delaunayNode.room2!)
            roomPairList.push(roomPair);
            delaunayNode.room1!.connectRoomList.push(delaunayNode.room2!, delaunayNode.room3!);
            delaunayNode.room1!.connectEdgeList.push(roomPair);

            delaunayNode.room2!.connectRoomList.push(delaunayNode.room1!, delaunayNode.room3!);
            delaunayNode.room2!.connectEdgeList.push(roomPair);

            delaunayNode.room3!.connectRoomList.push(delaunayNode.room3!, delaunayNode.room1!);
            delaunayNode.room3!.connectEdgeList.push(roomPair);
        }
        return roomPairList;
    }

}
export class Tree<T>{
    node: T;
    parent: Tree<T> | null;
    childList: Tree<T>[] = [];
    constructor(node: T) {
        this.node = node;
    }
}
class MinimumSpanningTree {
    static create(edgeList: RoomPair[]): Tree<RoomPair> {
        const sortedEdgeTreeList = edgeList
            .slice()
            .sort((a, b) => {
                return a.range - b.range;
            })
            .map(e => {
                const tree = new Tree<RoomPair>(e);
                e.parentTree = tree;
                return tree;
            });

        for (let edgeTree of sortedEdgeTreeList) {
            for (let connectEdge of edgeTree.node.pair1.connectEdgeList) {
                if (!UnionFind.same(edgeTree, connectEdge.parentTree!)) {
                    UnionFind.unite(edgeTree, connectEdge.parentTree!);
                }
            }
        }
        return UnionFind.getTop(sortedEdgeTreeList[0]);
    }
}
class UnionFind {
    static getTop<T>(tree: Tree<T>): Tree<T> {
        if (tree.parent == null) {
            return tree;
        }
        return UnionFind.getTop(tree.parent);
    }
    static same<T>(tree1: Tree<T>, tree2: Tree<T>): boolean {
        return UnionFind.getTop(tree1) == UnionFind.getTop(tree2);
    }
    static unite<T>(tree1: Tree<T>, tree2: Tree<T>): Tree<T> {
        if (Math.round(rangeRandom(0, 1)) == 0) {
            UnionFind.getTop(tree1).childList.push(UnionFind.getTop(tree2));
            return tree1;
        } else {
            UnionFind.getTop(tree2).childList.push(UnionFind.getTop(tree1));
            return tree2;
        }
    }
}
type RoomTree = {
    node: RoomPair;
    parent: RoomPair | null;
    childList: RoomTree[];
}