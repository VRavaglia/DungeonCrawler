import {ScnBattle} from './../scenes/ScnBattle';
import {Sprite, InteractionEvent} from "pixi.js";
import {Button} from "./Button";

export class AttackMenu{
    public sprite: Sprite;
    public buttons: Button[];
    private scnBattle: ScnBattle;

    constructor(scnBattle: ScnBattle, screenWidth: number, screenHeight: number) {
        this.scnBattle = scnBattle;
        this.sprite = Sprite.from("./ui/attackMenu.png");

        this.sprite.anchor.set(0.5, 0.5);
        //this.sprite.scale.set(-0.3, 0.3);
        this.sprite.x = screenWidth / 2;
        this.sprite.y = screenHeight / 5 * 4;

        this.buttons = [];
        this.buttons.push(new AtkButton(this.scnBattle, screenWidth, screenHeight));    
    }

    public allSprites(): Sprite[]{
        let sprites = [];

        sprites.push(this.sprite);
        for(let i = 0; i < this.buttons.length; i++){
            sprites.push(this.buttons[i].sprite);
        }

        return sprites;
    }
}

class AtkButton extends Button{
    private scnBattle: ScnBattle;
    constructor(scnBattle: ScnBattle, screenWidth: number, screenHeight: number) {
        super("./ui/bttn1.png");
        this.scnBattle = scnBattle;
        this.sprite.on("pointertap", this.onClick, this);

        this.sprite.anchor.set(0.5, 0.5);
        //this.sprite.scale.set(-0.3, 0.3);
        this.sprite.x = screenWidth / 6*3;
        this.sprite.y = screenHeight / 5 * 4;
    }
    private onClick(e: InteractionEvent): void {
        console.log(e);
        this.scnBattle.emit("atkBttn");
    }
}
