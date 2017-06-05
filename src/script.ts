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

class Point{
    constructor(public x:number = 0, public y:number = 0){
    }
    equals(point:Point):boolean{
        return (
            this.x - point.x < 0.001 &&
            this.y - point.y < 0.001
        );
    }
}
class Triangle{
    constructor(public p1:Point, public p2:Point, public p3: Point){
    }
    equals(triangle:Triangle):boolean{
        return (
            (this.p1.equals(triangle.p1) && this.p2.equals(triangle.p2) && this.p3.equals(triangle.p3)) ||
            (this.p1.equals(triangle.p2) && this.p2.equals(triangle.p3) && this.p3.equals(triangle.p1)) ||
            (this.p1.equals(triangle.p3) && this.p2.equals(triangle.p1) && this.p3.equals(triangle.p2)) ||

            (this.p1.equals(triangle.p3) && this.p2.equals(triangle.p2) && this.p3.equals(triangle.p1)) ||
            (this.p1.equals(triangle.p2) && this.p2.equals(triangle.p1) && this.p3.equals(triangle.p3)) ||
            (this.p1.equals(triangle.p1) && this.p2.equals(triangle.p3) && this.p3.equals(triangle.p2))
        );
    }

    hasCommonPoints(triangle:Triangle){
        return(
            this.p1.equals(triangle.p1) || this.p1.equals(triangle.p2) || this.p1.equals(triangle.p3) || 
            this.p2.equals(triangle.p1) || this.p2.equals(triangle.p2) || this.p2.equals(triangle.p3) || 
            this.p3.equals(triangle.p1) || this.p3.equals(triangle.p2) || this.p3.equals(triangle.p3)
        );
    }
}

class Room {
    constructor(public posX, public posY, public width: number, public height: number) {
    }
    draw(render:PIXI.Graphics){
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
        let width  = roundGridSize(rangeRandom(20, maxWidth),  gridSize);
        let height = roundGridSize(rangeRandom(20, maxHeight), gridSize);
        list.push(new Room(
            roundGridSize(rangeRandom(20, maxrangeX), gridSize) - width  / 2,
            roundGridSize(rangeRandom(20, maxrangeY), gridSize) - height / 2,
            width,
            height,
        ));
    }
    return list;
}
function delaunayTriangulation(roomList:Room[]){
    for(let room of roomList){
    }
}

console.log(roundGridSize(rangeRandom(0, 600), 4));
let pixi = new PIXI.Application(600, 600);
document.body.appendChild(pixi.view);
let render = new PIXI.Graphics();
pixi.stage.addChild(render);

let roomList = createRoomList(40, 40, 600, 600);
roomList.forEach((e)=>e.draw(render));