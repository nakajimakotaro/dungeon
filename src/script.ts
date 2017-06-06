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
            this.x - point.x < 0.001 &&
            this.y - point.y < 0.001
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
}
class Triangle {
    constructor(public p1: Point, public p2: Point, public p3: Point) {
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
    draw(render: PIXI.Graphics) {
        render
            .endFill()
            .lineStyle(1, 0xe91e63)
            .moveTo(this.p1.x, this.p1.y)
            .lineTo(this.p2.x, this.p2.y)
            .lineTo(this.p3.x, this.p3.y)
            .lineTo(this.p1.x, this.p1.y);
    }
}

class Room {
    constructor(public posX, public posY, public width: number, public height: number) {
    }
    draw(render: PIXI.Graphics) {
        render
            .beginFill(0xa0a0a0)
            .drawRect(this.posX - this.width / 2, this.posY - this.height / 2, this.width, this.height);
        console.log(this.posY);
        console.log(this.height);
    }
}

function createRoomList(maxWidth: number, maxHeight: number, maxrangeX: number, maxrangeY: number, gridSize: number = 4, pos: number = 10) {
    let list: Room[] = [];
    for (let count of range(pos)) {
        let width = roundGridSize(rangeRandom(20, maxWidth), gridSize);
        let height = roundGridSize(rangeRandom(20, maxHeight), gridSize);
        list.push(new Room(
            roundGridSize(rangeRandom(20, maxrangeX), gridSize) - width / 2,
            roundGridSize(rangeRandom(20, maxrangeY), gridSize) - height / 2,
            width,
            height,
        ));
    }
    return list;
}
function delaunayTriangulation(roomList: Room[]) {
    for (let room of roomList) {
    }
}

console.log(roundGridSize(rangeRandom(0, 600), 4));
let pixi = new PIXI.Application(600, 600);
document.body.appendChild(pixi.view);
let render = new PIXI.Graphics();
pixi.stage.addChild(render);

let roomList = createRoomList(40, 40, 600, 600);
roomList.forEach((e) => e.draw(render));

function getExternalTriangle(start: Point, end: Point): Triangle {
    const center = new Point((end.x - start.x) / 2 + start.x, (end.y - start.y) / 2 + start.y);
    const radius = Math.hypot(center.x - start.x, center.y - start.y) / 2;

    const A = new Point(center.x - radius * Math.sqrt(3), center.y + radius);
    const B = new Point(center.x + radius * Math.sqrt(3), center.y + radius);
    const C = new Point(center.x, center.y - radius * 2);
    return new Triangle(A, B, C);
}

const start = new Point(300, 300);
const end   = new Point(400, 400);
let triangle = getExternalTriangle(start, end);
const center = new Point((end.x - start.x) / 2 + start.x, (end.y - start.y) / 2 + start.y);
const radius = Math.hypot(center.x - start.x, center.y - start.y) / 2;
let circle = new Circle(center, radius);
triangle.draw(render);
circle.draw(render);