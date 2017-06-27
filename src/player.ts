import { MysteryDungeon, Wall } from "./mysteryDungeon";
import { Point } from "./shape";

export class Player {
    pos: Point;
    constructor(protected dungeon: MysteryDungeon) {
        this.pos = new Point(this.dungeon.roomList[0].centerX, this.dungeon.roomList[0].centerY);
        document.addEventListener("keydown", (e) => {
            const W = 87;
            const A = 65;
            const S = 83;
            const D = 68;
            let direction:"left" | "right" | "up" | "down" =  "left";
            switch (e.keyCode) {
                case W:
                    direction = "up";
                    break;
                case A:
                    direction = "left";
                    break;
                case S:
                    direction = "down";
                    break;
                case D:
                    direction = "right";
                    break;
            }
            this.walk(direction);

        })
    }
    update() {
    }
    draw(render: PIXI.Graphics) {
        render
            .beginFill(0xff0000)
            .drawRect(this.pos.x * 10, this.pos.y * 10, 10, 10);
    }
    walk(direction: "left" | "right" | "up" | "down"): boolean {
        let x = 0, y = 0;
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
        if (!this.dungeon.isGridRange(this.pos.x + x, this.pos.y + y)) {
            console.log(false)
            return false;
        }
        if (this.dungeon.grid[this.pos.x + x][this.pos.y + y].belong instanceof Wall) {
            console.log(false)
            return false;
        }
        this.dungeon.grid[this.pos.x][this.pos.y].chara = null;
        this.pos.x += x;
        this.pos.y += y;
        this.dungeon.grid[this.pos.x][this.pos.y].chara = this;
        return true;
    }
}
