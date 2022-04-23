import { AnimatedSprite, InteractionEvent, utils, Texture, Sprite} from "pixi.js";
import { HpBar } from "../menus/HpBar";
import { ScnBattle } from "../scenes/ScnBattle";

export enum AnimTypes{
    attack,
    defend,
    stand
}

export class BattleCharacter extends utils.EventEmitter{

    public readonly sprite: AnimatedSprite;
    public idx: number;
    private scnBattle: ScnBattle;
    private previousDims: number[] = [];
    
    public hp: number;
    public dmg: number;

    public receiveDamage: boolean = false;
    private hpBar: HpBar;

    constructor(scnBattle: ScnBattle, idx: number, stats: number[], pos: number[]) {
        super();
        let frames = ["./units/crusader.png",
                        "./units/crusader_attack.png",
                        "./units/crusader_defend.png"];

        this.sprite = new AnimatedSprite(frames.map((s) => Texture.from(s)));
        this.sprite.on("pointertap", this.onClicky, this);
        this.sprite.interactive = true;
        this.sprite.x = pos[0];
        this.sprite.y = pos[1];

        this.idx = idx;
        this.scnBattle = scnBattle;

        this.hp = stats[0];
        this.dmg = stats[1];

        this.hpBar = new HpBar(pos[0], pos[1]*2/5, this.hp);
    }

    private updateHp(amount: number){
        this.hp -= amount;
        console.log(this.hpBar);
        this.hpBar.updateHp(-amount);
    }

    public getSprites(): Sprite[]{
        let sprites: Sprite[] = this.hpBar.getSprites();
        sprites.unshift(this.sprite);

        return sprites;
    }

    public playAnim(anim: AnimTypes){
        switch(anim){
            case AnimTypes.attack:{
                this.previousDims = [this.sprite.x, this.sprite.y, this.sprite.scale.x, this.sprite.scale.y];
                this.sprite.gotoAndStop(1);
                this.sprite.scale.set(2*this.previousDims[2], 2*this.previousDims[3]);
                break;
            }
            case AnimTypes.defend:{
                this.previousDims = [this.sprite.x, this.sprite.y, this.sprite.scale.x, this.sprite.scale.y];
                this.sprite.gotoAndStop(2);
                this.sprite.scale.set(2*this.previousDims[2], 2*this.previousDims[3]);
                break;
            }
            case AnimTypes.stand:{
                this.sprite.gotoAndStop(0);
                this.sprite.position.set(this.previousDims[0], this.previousDims[1]);
                this.sprite.scale.set(this.previousDims[2], this.previousDims[3]);
                break;
            }
            default:{
                break;
            }
        }
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
        this.updateHp(amount);
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

