import "pixi.js";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
import { MysteryDungeon } from "./mysteryDungeon";
import { Player } from "./player";
export class Game{
    pixi: PIXI.Application;
    render: PIXI.Graphics;
    dungeon: MysteryDungeon;
    player: Player;
    constructor() {
        this.pixi = new PIXI.Application(600, 600);
        document.body.appendChild(this.pixi.view);
        this.render = new PIXI.Graphics();
        this.pixi.stage.addChild(this.render);
        this.dungeon = new MysteryDungeon(this);

        this.player = new Player(this.dungeon);
    }
    start() {
        this.loop();
        setInterval(() => this.loop(), this.nextFrameTime());
    }
    loop() {
        //update
        this.player.update();

        //draw
        this.render.clear();
        this.dungeon.draw(this.render);
        this.player.draw(this.render);
    }
    nextFrameTime() {
        return 16;
    }
}