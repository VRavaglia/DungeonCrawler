import { Sprite, InteractionEvent } from "pixi.js";
import { ScnBattle } from "../scenes/ScnBattle";



export class BattleCharacter{

    public readonly sprite: Sprite;
    public idx: number;
    private scnBattle: ScnBattle;
    

    constructor(sprite: string, scnBattle: ScnBattle, idx: number) {
        this.sprite = Sprite.from(sprite);
        this.sprite.on("pointertap", this.onClicky, this);
        this.sprite.interactive = true;
        this.idx = idx;
        this.scnBattle = scnBattle;
        
    }

    private onClicky(e: InteractionEvent): void {
        console.log(e)
        this.scnBattle.lastClicked = this.idx;
        this.scnBattle.emit("changedTarget");
    }
}

