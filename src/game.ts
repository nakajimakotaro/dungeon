import "pixi.js";
import Stats = require("stats.js");
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
import { MysteryDungeon } from "./mysteryDungeon";
import { GameMap } from "./gameMap";
import { Player } from "./player";
import { Enemy } from "./enemy";
import { InputManager } from "./inputManager";

export class Game{
    stats:Stats;
    pixi: PIXI.Application;
    render: PIXI.Graphics;
    map: GameMap;
    player: Player;
    enemyList: Enemy[];
    inputManager:InputManager;
    frame = 0;
    constructor() {
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
        this.pixi = new PIXI.Application(600, 600);
        document.body.appendChild(this.pixi.view);
        this.render = new PIXI.Graphics();
        this.pixi.stage.addChild(this.render);

        this.inputManager = new InputManager(this);
        this.map = new MysteryDungeon(this);

        this.player = new Player(this);
        this.enemyList = new Array(5).fill(0).map((e, i)=>new Enemy(this, i));
    }
    start() {
        setInterval(() => this.loop(), this.nextFrameTime());
    }
    loop() {
        this.stats.begin();
        //update
        this.player.update();
        this.enemyList.forEach(e=>e.update());

        //draw
        this.render.clear();
        this.map.draw(this.render);
        this.player.draw(this.render);
        this.enemyList.forEach(e=>e.draw(this.render));
        this.frame++;
        this.stats.end();
    }
    nextFrameTime() {
        return 16;
    }
}