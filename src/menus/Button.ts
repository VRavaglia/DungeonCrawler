import {Sprite} from "pixi.js";
export class Button {
    public sprite: Sprite;
    constructor(sprite: string) {
        this.sprite = Sprite.from(sprite);
        this.sprite.interactive = true;
    }
}