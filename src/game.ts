import "pixi.js";
import Stats = require("stats.js");
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
import { MysteryDungeon } from "./mysteryDungeon";
import { GameMap } from "./gameMap";
import { AI, TerritoryAI, PlayerCntrol } from "./AI";
import { Character} from "./character";
import { InputManager } from "./inputManager";

export class Game{
    stats:Stats;
    pixi: PIXI.Application;
    render: PIXI.Graphics;
    map: GameMap;
    charaList:Character[] = [];
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

        let player = new Character(this);
        player.ai = new PlayerCntrol(this, player);
        player.addMap(this.map.roomList[0].centerX, this.map.roomList[0].centerY + 1, 0);
        player.color = 0xff0000;
        this.charaList.push(player);
        this.charaList.push(...new Array(5).fill(0).map((e, i)=>{
            let enemy = new Character(this);
            enemy.addMap(this.map.roomList[i].centerX, this.map.roomList[i].centerY, 0);
            enemy.ai = new TerritoryAI(this, enemy, enemy.pos.x, enemy.pos.y, 5);
            enemy.color = 0x00ff00;
            return enemy;
        }));
    }
    start() {
        setInterval(() => this.loop(), this.nextFrameTime());
    }
    loop() {
        this.stats.begin();
        //update
        this.charaList.forEach(e=>e.update());

        //draw
        this.render.clear();
        this.map.draw(this.render);
        this.charaList.forEach(e=>e.draw(this.render));
        this.frame++;
        this.stats.end();
    }
    nextFrameTime() {
        return 16;
    }
}