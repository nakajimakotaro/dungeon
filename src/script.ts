import "pixi.js";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
import { MysteryDungeon} from "./mysteryDungeon";


let pixi = new PIXI.Application(600, 600);
document.body.appendChild(pixi.view);
let render = new PIXI.Graphics();
pixi.stage.addChild(render);

let dungeon = new MysteryDungeon();
dungeon.draw(render);
let count = 0;