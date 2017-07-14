import { Game } from "./game";
import { GameMap } from "./gameMap";
import json5 = require("json5");
import { Character} from "./character";
import { DungeonGenerater, MysteryDungeonParameter, CharacterGenerater } from "./dungeonGenerator";
import { Dungeon} from "./dungeon";

type ManualMapParameter = {
    kind: "ManualMap";
}
class ManualMap{
    static generate(game: Game, parameter: ManualMapParameter): GameMap{
        //TODO未動作
        return new GameMap(game, [[]]);
    }
}

export type MapParameter = {
    map: MysteryDungeonParameter;
    character: {
        list: string[],
        volume: number,
    }
};

export class MapGenerater {
    static async generate(game: Game, parameterPath: string){
        const levelParameter = await MapGenerater.getMapParameter(parameterPath);
        const dungeon = MapGenerater.map(game, levelParameter);
        dungeon.charaList = await CharacterGenerater.generate(game, dungeon, levelParameter.character);
        return dungeon;
    }
    static async getMapParameter(parameterPath:string){
        return json5.parse(
            await new Promise((resolve) => {
                const require = new XMLHttpRequest();
                require.open("GET", parameterPath);
                require.addEventListener("loadend", () => {
                    resolve(require.responseText);
                });
                require.send();
            }) as string
        ) as MapParameter;
    }
    static map(game:Game, levelParameter:MapParameter){
        if(levelParameter.map.kind == "MysteryDungeon"){
            return DungeonGenerater.generate(game, levelParameter.map);
        }else{
            return DungeonGenerater.generate(game, levelParameter.map);
        }
    }
}