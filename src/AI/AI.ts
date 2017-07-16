import { Game } from "../game";
import { Character } from "../character";
import { Point } from "../shape";
import {TerritoryAI, TerritoryAIParameter} from "./territoryAI";
import {PlayerControl, PlayerControlParameter} from "./playerControl";

export type AIParameter = TerritoryAIParameter|PlayerControlParameter;

export abstract class AI {
    abstract update();
    static AIList = {
        TerritoryAI: TerritoryAI.generate,
        PlayerControl: PlayerControl.generate,
    };
    static generate(game:Game, chara: Character, parameter:AIParameter){
        return AI.AIList[parameter.name](game, chara, parameter);
    }
}