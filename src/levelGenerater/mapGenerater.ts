import { Game } from "../game";
import { GameMap } from "../gameMap";
import { Character} from "../character";
import { DungeonGenerater, MysteryDungeonParameter } from "./dungeonGenerater";
import { Util } from "../util";
import {CharacterGenerater, CharacterGenerateParameter} from "./characterGenerater";
import { Dungeon} from "../dungeon";

type ManualMapParameter = {
    kind: "ManualMap";
}
class ManualMap{
    static generate(game: Game, parameter: ManualMapParameter): GameMap{
        //TODO未動作
        return new GameMap(game, [[]]);
    }
}

export type LevelParameter = {
    map: MysteryDungeonParameter,
    character: CharacterGenerateParameter[],
};

export class MapGenerater {
    static async generate(game: Game, parameterPath: string){
        const levelParameter = await Util.getJson5(parameterPath) as LevelParameter;
        const dungeon = MapGenerater.map(game, levelParameter);
        dungeon.charaList = await CharacterGenerater.generate(game, dungeon, levelParameter.character);
        return dungeon;
    }
    static map(game:Game, levelParameter:LevelParameter){
        if(levelParameter.map.kind == "MysteryDungeon"){
            return DungeonGenerater.generate(game, levelParameter.map);
        }else{
            return DungeonGenerater.generate(game, levelParameter.map);
        }
    }
}