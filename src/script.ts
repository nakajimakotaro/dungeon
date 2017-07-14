import {Game} from "./game";

let game = new Game();
game.load("resource/map/dungeon1.json5").then(()=>{
    game.start();
});
