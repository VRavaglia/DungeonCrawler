import { Sprite } from "pixi.js";

export class HpBar{
    private currentValue: number;
    private maxValue: number;
    private fullBar: Sprite;
    private emptyBar: Sprite;

    constructor(x: number, y: number, max: number){
        this.currentValue = max;
        this.maxValue = max;
        this.fullBar = Sprite.from("./ui/hp_full.png");
        this.emptyBar = Sprite.from("./ui/hp_empty.png");

        this.fullBar.anchor.set(0.5, 0.5);
        this.fullBar.scale.set(0.5, 0.5);
        this.fullBar.x = x;
        this.fullBar.y = y;
        this.emptyBar.anchor.set(0.5, 0.5);
        this.emptyBar.scale.set(0.5, 0.5);
        this.emptyBar.x = x;
        this.emptyBar.y = y;
    }

    public getSprites(): Sprite[]{
        return [this.fullBar, this.emptyBar];
    }

    public updateHp(hpIncrease: number){
        this.currentValue = Math.max(0, Math.min(this.currentValue + hpIncrease, this.maxValue));
        this.fullBar.scale.set(this.currentValue/this.maxValue,1);
    }
}