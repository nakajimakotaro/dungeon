import {Room} from "./room";
import {Cause} from "./cause";
import {PathWay} from "./pathway";
import {Wall} from "./wall";
import {Item} from "./item";
import {Character} from "./character";

export class Cell {
    constructor(
        public x: number,
        public y: number,
        public size: number,
        public belong: Room | PathWay | Wall,
        public items: Item[] = [],
        public chara: Character | null = null,
        public color: number = 0) {
    }
    draw(render: PIXI.Graphics) {
        render
            .beginFill(this.color)
            .drawRect(this.x * this.size, this.y * this.size, this.size, this.size);
    }
    fireCause(cause:Cause){
        this.items.forEach(a=>a.fireCause(cause));
        if(this.chara){
            this.chara.fireCause(cause);
        }
    }
}
