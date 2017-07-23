import { Game } from "./game";

export class InputManager {
    private keyStatusList: { [key: string]: boolean } = {};
    constructor(game: Game) {
        document.addEventListener("keyup", e => this.keyup(e));
        document.addEventListener("keydown", e => this.keydown(e));
    }
    private keyup(e: KeyboardEvent) {
        this.keyStatusList[e.key] = false;
    }
    private keydown(e: KeyboardEvent) {
        this.keyStatusList[e.key] = true;
    }
    getKeyStatus(key: string): boolean{
        return this.keyStatusList[key];
    }
    //"awsd"のように指定する
    getKeySomeStatus(key: string): boolean {
        return key.split("").map(e=>this.getKeyStatus(e)).findIndex(e=>e) != -1;
    }
}