import "pixi.js";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
import { MysteryDungeon } from "./mysteryDungeon";
import { Player } from "./player";
import { Enemy } from "./enemy";
import { InputManager } from "./inputManager";

export class Game{
    pixi: PIXI.Application;
    render: PIXI.Graphics;
    dungeon: MysteryDungeon;
    player: Player;
    enemyList: Enemy[];
    inputManager:InputManager;
    frame = 0;
    constructor() {
        this.pixi = new PIXI.Application(600, 600);
        document.body.appendChild(this.pixi.view);
        this.render = new PIXI.Graphics();
        this.pixi.stage.addChild(this.render);
        this.inputManager = new InputManager(this);
        this.dungeon = new MysteryDungeon(this);

        this.player = new Player(this);
        this.enemyList = new Array(5).fill(0).map((e, i)=>new Enemy(this, i));
    }
    start() {
        this.loop();
        setInterval(() => this.loop(), this.nextFrameTime());
    }
    loop() {
        //update
        this.player.update();
        this.enemyList.forEach(e=>e.update());

        //draw
        this.render.clear();
        this.dungeon.draw(this.render);
        this.player.draw(this.render);
        this.enemyList.forEach(e=>e.draw(this.render));
        this.frame++;
    }
    nextFrameTime() {
        return 16;
    }
}