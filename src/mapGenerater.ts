import { Game } from "./game";
import { GameMap } from "./gameMap";
import json5 = require("json5");
import { CharacterGenerator, CharacterGenerateParameter } from "./characterGenerator";
import { DungeonGenerator, MysteryDungeonParameter } from "./dungeonGenerator";
import { Dungeon} from "./dungeon";

type ManualMapParameter = {
    kind: "ManualMap";
}
class ManualMap{
    static generate(game: Game, parameter: ManualMapParameter): GameMap{
        return new GameMap(game, [[]]);
    }
}

type MapParameter = MysteryDungeonParameter|ManualMapParameter;

export class MapGenerater {
    static async generate(game: Game, parameterPath: string){
        const mapParameter = json5.parse(
            await new Promise((resolve) => {
                const require = new XMLHttpRequest();
                require.open("GET", parameterPath);
                require.addEventListener("loadend", () => {
                    resolve(require.responseText);
                });
                require.send();
            })
        ) as MapParameter;
        if(mapParameter.kind == "MysteryDungeon"){
            return DungeonGenerator.generate(game, mapParameter);
        }else{
            return DungeonGenerator.generate(game, mapParameter);
        }
    }
}