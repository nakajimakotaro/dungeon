import { Game } from "../game";
import { Character } from "../character";
import { Point } from "../shape";
import {TerritoryAI, TerritoryAIParameter} from "./territoryAI";
import {PlayerControl, PlayerControlParameter} from "./playerControl";

export type AIParameter = TerritoryAIParameter|PlayerControlParameter;

export abstract class AI {
    abstract update();  //毎フレーム呼ばれる
    abstract turnUpdate();  //自分のターンになると呼ばれる trueを返すと自分のターンが終わる
    abstract turnStart();  //自分のターンになると呼ばれる trueを返すと自分のターンが終わる
    static AIList = {
        TerritoryAI: TerritoryAI.generate,
        PlayerControl: PlayerControl.generate,
    };
    static generate(game:Game, chara: Character, parameter:AIParameter){
        return AI.AIList[parameter.name](game, chara, parameter);
    }
}