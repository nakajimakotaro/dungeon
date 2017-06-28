import {Room} from "./room";
import {PathWay} from "./pathWay";
import {Wall} from "./wall";
import {Item} from "./item";
import {Character} from "./character";

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
    draw(render: PIXI.Graphics) {
        render
            .beginFill(this.color)
            .drawRect(this.x * this.gridSize, this.y * this.gridSize, this.gridSize, this.gridSize);
    }
}
