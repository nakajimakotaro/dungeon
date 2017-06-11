import "pixi.js";
import { Triangle, Circle, Point } from "./shape";
import { Room } from "./room";
import { MysteryDungeon, Tree, RoomPair } from "./mysteryDungeon";


let pixi = new PIXI.Application(600, 600);
document.body.appendChild(pixi.view);
let render = new PIXI.Graphics();
pixi.stage.addChild(render);

let dungeon = new MysteryDungeon();
let count = 0;
function tadoru(tree: Tree<RoomPair>, count:number = 0) {
    render
        .endFill()
        .lineStyle(1, 0xff00ff)
        .moveTo(tree.node.pair1.pos.x, tree.node.pair1.pos.y)
        .lineTo(tree.node.pair2.pos.x, tree.node.pair2.pos.y);
    console.log(tree.childList);
    for (let child of tree.childList) {
        tadoru(child, count + 1);
    }
}
tadoru(dungeon.roomTree);