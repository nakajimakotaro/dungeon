import { Game } from "./game";
import json5 = require("json5");
import { CharacterGenerator, CharacterGenerateParameter } from "./characterGenerator";
import { DungeonGenerator, MysteryDungeonParameter } from "./dungeonGenerator";
import { Dungeon} from "./dungeon";

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
        ) as MysteryDungeonParameter;
        return DungeonGenerator.generate(game, mapParameter);
    }
}