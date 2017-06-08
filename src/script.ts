import "pixi.js";

function rangeRandom(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}
function range(range: number) {
    return new Array(range).fill(0).map((e, i) => i);
}
function roundGridSize(value: number, gridSize: number): number {
    return Math.round(value - value % gridSize);
}

class Point {
    constructor(public x: number = 0, public y: number = 0) {
    }
    equals(point: Point): boolean {
        return (
            Math.abs(this.x - point.x) < 0.001 &&
            Math.abs(this.y - point.y) < 0.001
        );
    }
}
class Circle {
    constructor(public center: Point, public r: number) {
    }
    equals(c: Circle) {
        return this.center.equals(c.center) && this.r == c.r;
    }
    draw(render: PIXI.Graphics) {
        render
            .endFill()
            .lineStyle(1, 0x9c27b0)
            .drawCircle(this.center.x, this.center.y, this.r);
    }
    contains(p: Point) {
        return Math.hypot(this.center.x - p.x, this.center.y - p.y) < this.r;
    }
}
class Triangle {
    constructor(public p1: Point, public p2: Point, public p3: Point, public room1: Room | null = null, public room2: Room | null = null, public room3: Room | null = null) {
    }
    equals(triangle: Triangle): boolean {
        return (
            (this.p1.equals(triangle.p1) && this.p2.equals(triangle.p2) && this.p3.equals(triangle.p3)) ||
            (this.p1.equals(triangle.p2) && this.p2.equals(triangle.p3) && this.p3.equals(triangle.p1)) ||
            (this.p1.equals(triangle.p3) && this.p2.equals(triangle.p1) && this.p3.equals(triangle.p2)) ||

            (this.p1.equals(triangle.p3) && this.p2.equals(triangle.p2) && this.p3.equals(triangle.p1)) ||
            (this.p1.equals(triangle.p2) && this.p2.equals(triangle.p1) && this.p3.equals(triangle.p3)) ||
            (this.p1.equals(triangle.p1) && this.p2.equals(triangle.p3) && this.p3.equals(triangle.p2))
        );
    }

    hasCommonPoints(triangle: Triangle) {
        return (
            this.p1.equals(triangle.p1) || this.p1.equals(triangle.p2) || this.p1.equals(triangle.p3) ||
            this.p2.equals(triangle.p1) || this.p2.equals(triangle.p2) || this.p2.equals(triangle.p3) ||
            this.p3.equals(triangle.p1) || this.p3.equals(triangle.p2) || this.p3.equals(triangle.p3)
        );
    }
    toString(): string {
        let hashList:number[] = [];

        hashList.push(this.p1.x << 16 | this.p1.y);
        hashList.push(this.p2.x << 16 | this.p2.y);
        hashList.push(this.p3.x << 16 | this.p3.y);
        hashList.sort();
        return (
            `${hashList[0]} - ${hashList[1]} - ${hashList[2]}`
        );
    }
    draw(render: PIXI.Graphics, color: number) {
        render
            .endFill()
            .lineStyle(1, color)
            .moveTo(this.p1.x, this.p1.y)
            .lineTo(this.p2.x, this.p2.y)
            .lineTo(this.p3.x, this.p3.y)
            .lineTo(this.p1.x, this.p1.y);
    }
    // ======================================  
    // 三角形を与えてその外接円を求める  
    // ======================================
    getCircumscribedCircle(): Circle {
        // 三角形の各頂点座標を (x1, y1), (x2, y2), (x3, y3) とし、  
        // その外接円の中心座標を (x, y) とすると、  
        //     (x - x1) * (x - x1) + (y - y1) * (y - y1)  
        //   = (x - x2) * (x - x2) + (y - y2) * (y - y2)  
        //   = (x - x3) * (x - x3) + (y - y3) * (y - y3)  
        // より、以下の式が成り立つ  
        //  
        // x = { (y3 - y1) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1)  
        //     + (y1 - y2) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1)} / c  
        //  
        // y = { (x1 - x3) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1)  
        //     + (x2 - x1) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1)} / c  
        //  
        // ただし、  
        //   c = 2 * {(x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1)}  

        const x1 = this.p1.x;
        const y1 = this.p1.y;
        const x2 = this.p2.x;
        const y2 = this.p2.y;
        const x3 = this.p3.x;
        const y3 = this.p3.y;

        const c = 2.0 * ((x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1));
        const x = ((y3 - y1) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1)
            + (y1 - y2) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1)) / c;
        const y = ((x1 - x3) * (x2 * x2 - x1 * x1 + y2 * y2 - y1 * y1)
            + (x2 - x1) * (x3 * x3 - x1 * x1 + y3 * y3 - y1 * y1)) / c;
        const center = new Point(x, y);

        // 外接円の半径 r は、半径から三角形の任意の頂点までの距離に等しい  
        const r = Math.hypot(center.x - this.p1.x, center.y - this.p1.y);

        return new Circle(center, r);
    }
}

class Room {
    connectRoomList: Room[] = [];
    constructor(public pos: Point, public width: number, public height: number) {
    }
    draw(render: PIXI.Graphics, lineDraw: boolean = false) {
        render
            .lineStyle(0)
            .beginFill(0xa0a0a0)
            .drawRect(this.pos.x - this.width / 2, this.pos.y - this.height / 2, this.width, this.height);
        if (lineDraw) {
            for (let connectRoom of this.connectRoomList) {
                render
                    .endFill()
                    .lineStyle(1, 0x3399cc)
                    .moveTo(this.pos.x, this.pos.y)
                    .lineTo(connectRoom.pos.x, connectRoom.pos.y);
            }
        }
    }
}

function createRoomList(maxWidth: number, maxHeight: number, maxrangeX: number, maxrangeY: number, gridSize: number = 4, pos: number = 10) {
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
//指定した矩形を内包する三角形を返す
function getExternalTriangle(start: Point, end: Point): Triangle {
    const center = new Point((end.x - start.x) / 2 + start.x, (end.y - start.y) / 2 + start.y);
    const radius = Math.hypot(end.x - start.x, end.y - start.y) / 2;

    const A = new Point(center.x - radius * Math.sqrt(3), center.y + radius);
    const B = new Point(center.x + radius * Math.sqrt(3), center.y + radius);
    const C = new Point(center.x, center.y - radius * 2);
    console.log(A);
    console.log(B);
    console.log(C);
    return new Triangle(A, B, C);
}
//ドロネー三角形分割をする
function delaunayTriangulation(roomList: Room[]) {
    //分割した三角形
    const triangleMap = new Map<string, Triangle>();
    //最初のすべてを含む三角形
    const hugaTriangle = getExternalTriangle(new Point(0, 0), new Point(600, 600));
    triangleMap.set(hugaTriangle.toString(), hugaTriangle);

    const graphicsList: PIXI.Graphics[] = [];

    for (let room of roomList) {
        //追加候補の三角形を保持するハッシュ
        //booleanがtrueなら重複はない
        const tmptriangleMap = new Map<string, { t: Triangle, bool: boolean }>();
        for (let triangle of triangleMap.values()) {
            //外接円を取得して
            const circle = triangle.getCircumscribedCircle();
            //外接円の中に点があれば
            if (circle.contains(room.pos)) {
                //tmpTriangleMapに追加する
                //重複する三角形ならboolをfalseにする
                function tmpSet(t: Triangle) {
                    if (tmptriangleMap.has(t.toString()) || triangleMap.has(t.toString())) {
                        tmptriangleMap.set(t.toString(), { t: t, bool: false });
                    } else {
                        tmptriangleMap.set(t.toString(), { t: t, bool: true });
                    }
                }
                //その三角形を削除し新たに分割しなおす
                const t1 = new Triangle(room.pos, triangle.p1, triangle.p2, room, triangle.room1, triangle.room2);
                tmpSet(t1);
                const t2 = new Triangle(room.pos, triangle.p2, triangle.p3, room, triangle.room2, triangle.room3);
                tmpSet(t2);
                const t3 = new Triangle(room.pos, triangle.p3, triangle.p1, room, triangle.room3, triangle.room1);
                tmpSet(t3);
                const graphics = new PIXI.Graphics();
                triangleMap.forEach((e) => e.draw(graphics, 0xff0000));
                tmptriangleMap.forEach((e) => e.t.draw(graphics, 0x00ff00));
                graphicsList.push(graphics);

                triangleMap.delete(triangle.toString());
            }
        }
        //三角形を追加
        for (let triangle of tmptriangleMap.values()) {
            //重複を除く
            if (triangle.bool) {
                triangleMap.set(triangle.t.toString(), triangle.t);
            }
        }
    }
    //最初の三角形を頂点に持っている三角形を削除
    for (let triangle of triangleMap.values()) {
        if (triangle.hasCommonPoints(hugaTriangle)) {
            triangleMap.delete(triangle.toString());
        }
    }

    for (let triangle of triangleMap.values()) {
        triangle.room1!.connectRoomList.push(triangle.room2!);
        triangle.room1!.connectRoomList.push(triangle.room3!);

        triangle.room2!.connectRoomList.push(triangle.room1!);
        triangle.room2!.connectRoomList.push(triangle.room3!);

        triangle.room3!.connectRoomList.push(triangle.room1!);
        triangle.room3!.connectRoomList.push(triangle.room2!);
    }
    const graphics = new PIXI.Graphics();
    triangleMap.forEach((e) => e.draw(graphics, 0xff0000));
    graphicsList.push(graphics);
    return graphicsList;
}

let pixi = new PIXI.Application(600, 600);
document.body.appendChild(pixi.view);
let render = new PIXI.Graphics();
pixi.stage.addChild(render);

let roomList = createRoomList(40, 40, 600, 600, 4, 300);
const graphicsList = delaunayTriangulation(roomList);
let i = 0;
function draw() {
    const graphics = graphicsList[i];
    render.addChild(graphicsList[i]);
    render.removeChild(graphicsList[i - 1]);
    i++;
    if (graphicsList.length > i) {
        requestAnimationFrame(draw);
    } else {
        //roomList.forEach(e => e.draw(render, true));
    }
}
draw();

//roomList.forEach(e => e.draw(render, true))