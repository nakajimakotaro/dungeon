import {Game} from "./game";

let game = new Game();
game.load("map/dungeon1.json5").then(()=>{
    game.start();
});
