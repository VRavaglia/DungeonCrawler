import { Sprite, InteractionEvent, utils} from "pixi.js";
import { ScnBattle } from "../scenes/ScnBattle";



export class BattleCharacter extends utils.EventEmitter{

    public readonly sprite: Sprite;
    public idx: number;
    private scnBattle: ScnBattle;
    
    public hp: number;
    public dmg: number;

    public receiveDamage: boolean = false;

    constructor(sprite: string, scnBattle: ScnBattle, idx: number, stats: number[]) {
        super();
        this.sprite = Sprite.from(sprite);
        this.sprite.on("pointertap", this.onClicky, this);
        this.sprite.interactive = true;
        this.idx = idx;
        this.scnBattle = scnBattle;

        this.hp = stats[0];
        this.dmg = stats[1];
    }

    private onClicky(e: InteractionEvent): void {
        console.log(e)
        this.scnBattle.lastClicked = this.idx;
        this.scnBattle.emit("changedTarget");
    }

    public onAttackReceived(source: BattleCharacter): void{
        this.receiveDamage = true;
        console.log("Source: ", source);
    }

    public onAttackDelt(targets: BattleCharacter[]): void{
        for(let i = 0; i < targets.length; i++){
            console.log("Target: ", targets[i]);
        }       
    }

    public onDamageReceived(amount: number): void{
        this.hp -= amount;
        console.log("Amount received: ", amount);
    }

    public onDamageDelt(amount: number): void{
        console.log("Amount delt: ", amount);
    }

    public onEndDamage(): void{
        this.receiveDamage = false;
        if(this.hp <= 0){
            this.onDeath();
        }
    }

    public onDeath(): void{
        this.scnBattle.emit("characterDeath");
    };
}

