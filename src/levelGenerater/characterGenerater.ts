import { Game } from "../game";
import { Dungeon } from "../dungeon";
import { AI, AIParameter } from "../AI/AI";
import { Character } from "../character";
import { Util } from "../util";

//mapのキャラを自動生成する
export type CharacterGenerateParameter = {
    list: string[],
    volume: number,
}

//キャラの情報(Playerとかスライムとか)
type CharacterInfo = {
    name: string;
    color: number;
    baseHp: number;
    group: string;
    defaultAI: AIParameter;
}
let characterList: Map<string, string> = new Map();
const CharacterListLoadPromise = (async () => {
    const charaListJson = await Util.getJson5("resource/character/charaList.json5");

    for (let charaKey of Object.keys(charaListJson)) {
        const charaUrl = charaListJson[charaKey];
        characterList.set(charaKey, charaUrl);
    }
    return Promise.resolve();
})();

export class CharacterGenerater {
    static async generate(game: Game, dungeon: Dungeon, parameterList: CharacterGenerateParameter[]) {
        await CharacterListLoadPromise;
        const charaPromiseList: Promise<Character>[] = [];
        for (let parameter of parameterList) {
            for (let count of Util.range(parameter.volume)) {
                charaPromiseList.push(CharacterGenerater.charaGenerate(game, dungeon, characterList.get(Util.randomSelectArray(parameter.list)!)!));
            }
        }

        const charaMap: Map<Character, Character> = new Map();
        for(let chara of await Promise.all(charaPromiseList)){
            charaMap.set(chara, chara);
        }
        return charaMap;
    }
    static async charaGenerate(game: Game, dungeon: Dungeon, enemyInfoPath: string) {
        const charaInfo: CharacterInfo = await Util.getJson5(enemyInfoPath) as CharacterInfo;
        const chara = new Character(game, charaInfo.baseHp + dungeon.level * 3, Util.randomSelectArray(dungeon.roomList).pos.clone(), 0, charaInfo.color, charaInfo.group);
        chara.ai = AI.generate(game, chara, charaInfo.defaultAI);
        return chara;
    }
}