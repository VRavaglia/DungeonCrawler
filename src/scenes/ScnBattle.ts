import { Container } from "pixi.js";
import { BattleCharacter } from './../units/BattleCharacter';
import { GameState } from './../GameState';

export class ScnBattle extends Container {
    private readonly screenWidth: number;
    private readonly screenHeight: number;
    
    private allies: BattleCharacter[];
    private enemies: BattleCharacter[];

    constructor(screenWidth: number, screenHeight: number, gameState: GameState) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.allies = [];
        this.enemies = [];

        for(var i = 0; i < gameState.allies; i++) {
            let ally = new BattleCharacter("clampy.png");
            ally.sprite.anchor.set(0.5, 0.5);
            ally.sprite.scale.set(0.3, 0.3);
            ally.sprite.x = this.screenWidth / 10 * (i+1);
            ally.sprite.y = this.screenHeight / 2;
            this.allies.push(ally);
            this.addChild(ally.sprite);
        }

        for(var i = 0; i < gameState.enemies; i++) {
            let enemy = new BattleCharacter("clampy.png");
            enemy.sprite.anchor.set(0.5, 0.5);
            enemy.sprite.scale.set(0.3, 0.3);
            enemy.sprite.x = this.screenWidth / 10 * (i+6);
            enemy.sprite.y = this.screenHeight / 2;
            this.enemies.push(enemy);
            this.addChild(enemy.sprite);
        }
        
    
        
    }
}
