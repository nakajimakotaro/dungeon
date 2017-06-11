import {Room} from "./room";

export class Point {
    constructor(public x: number = 0, public y: number = 0) {
    }
    equals(point: Point): boolean {
        return (
            Math.abs(this.x - point.x) < 0.001 &&
            Math.abs(this.y - point.y) < 0.001
        );
    }
}
export class Circle {
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
export class Triangle {
    constructor(public p1: Point, public p2: Point, public p3: Point) {
    }
    //指定した矩形を内包する三角形を返す
    static createIncludeRect(start: Point, end: Point): Triangle {
        const center = new Point((end.x - start.x) / 2 + start.x, (end.y - start.y) / 2 + start.y);
        const radius = Math.hypot(end.x - start.x, end.y - start.y) / 2;

        const A = new Point(Math.round(center.x - radius * Math.sqrt(3)), Math.round(center.y + radius));
        const B = new Point(Math.round(center.x + radius * Math.sqrt(3)), Math.round(center.y + radius));
        const C = new Point(Math.round(center.x), Math.round(center.y - radius * 2));
        return new Triangle(A, B, C);
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
