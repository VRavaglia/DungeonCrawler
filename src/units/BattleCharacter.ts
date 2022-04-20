import { Sprite } from "pixi.js";

export class BattleCharacter{
    public readonly sprite: Sprite;
    constructor(sprite: string) {
        this.sprite = Sprite.from(sprite);
    }
}