import { Game } from "./game";

export class InputManager {
    private keyStatusList: { [key: string]: "release" | "push" } = {};
    constructor(game: Game) {
        document.addEventListener("keyup", e => this.keyup(e));
        document.addEventListener("keydown", e => this.keydown(e));
    }
    private keyup(e: KeyboardEvent) {
        this.keyStatusList[e.key] = "release";
    }
    private keydown(e: KeyboardEvent) {
        this.keyStatusList[e.key] = "push";
    }
    getKeyStatus(key: string): "release" | "push" {
        return this.keyStatusList[key] ? this.keyStatusList[key] : "release";
    }
}