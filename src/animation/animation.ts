import {Character} from "../character";
export abstract class Animation{
    abstract name: string;
    abstract startFunc(): void;
    abstract updateFunc(): void;
    abstract endFunc(): void;
    abstract transformFunc(manager: AnimationManager): void;
}

export class AnimationManager{
    currentAnime: Animation|null;
    animeTable:{[key:string]: Animation} = {};
    constructor(){
    }
    add(anime: Animation){
        this.animeTable[anime.name] = anime;
    }
    update(){
        if(!this.currentAnime){
            return;
        }
        this.currentAnime.updateFunc();
        this.currentAnime.transformFunc(this);
    }
    play(name:string){
        if(!this.currentAnime){
            return;
        }
        this.currentAnime.endFunc();
        this.currentAnime = this.animeTable[name];
        this.currentAnime.startFunc();
    }
}