import { Point } from "./shape";
import { RoomPair } from "./mysteryDungeon";
export class Room {
    connectRoomList: Room[] = [];
    connectEdgeList: RoomPair[] = [];
    constructor(public pos: Point, public width: number, public height: number) {
    }
    draw(render: PIXI.Graphics, lineDraw: boolean = false) {
        render
            .beginFill(0x3399cc)
            .drawRect(
            this.pos.x - this.width / 2,
            this.pos.y - this.height / 2,
            this.width,
            this.height
            );
    }
}