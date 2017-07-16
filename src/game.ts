import "pixi.js";
import Stats = require("stats.js");
import {LevelGenerater} from "./levelGenerater/MapGenerater";
import { GameMap } from "./gameMap";
import { InputManager } from "./inputManager";

export class Game{
    stats:Stats;
    pixi: PIXI.Application;
    render: PIXI.Graphics;
    map: GameMap;
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
    }
    async load(mapPath){
        this.map = await LevelGenerater.generate(this, mapPath);
    }
    start() {
        setInterval(() => this.loop(), this.nextFrameTime());
    }
    loop() {
        this.stats.begin();
        //update
        this.map.update();

        //draw
        this.render.clear();
        this.map.draw(this.render);
        this.frame++;
        this.stats.end();
    }
    nextFrameTime() {
        return 16;
    }
}