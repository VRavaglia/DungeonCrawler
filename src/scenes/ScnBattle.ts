import { Container } from "pixi.js";
import { BattleCharacter } from './../units/BattleCharacter';
import { GameState } from './../GameState';

enum State{
    waiting,
    clickedAlly,
    clickedEnemy
};

export class ScnBattle extends Container {
    private readonly screenWidth: number;
    private readonly screenHeight: number;
    
    private allies: BattleCharacter[];
    private enemies: BattleCharacter[];

    public lastClicked: number;
    
    private state: State;
    private allyCount : number;
    private enemyCount : number;

    constructor(screenWidth: number, screenHeight: number, gameState: GameState) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.allies = [];
        this.enemies = [];
        this.lastClicked = -1;
        this.state = State.waiting;
        this.allyCount = gameState.allies;
        this.enemyCount = gameState.enemies;

        for(var i = 0; i < this.allyCount; i++) {
            let ally = new BattleCharacter("crusader.png", this, i);
            ally.sprite.anchor.set(0.5, 0.5);
            ally.sprite.scale.set(0.3, 0.3);
            ally.sprite.x = this.screenWidth / 10 * (i+1);
            ally.sprite.y = this.screenHeight / 2;
            this.allies.push(ally);
            this.addChild(ally.sprite);
        }

        for(var i = 0; i < this.enemyCount; i++) {
            let enemy = new BattleCharacter("crusader.png", this, i+this.allyCount);
            enemy.sprite.anchor.set(0.5, 0.5);
            enemy.sprite.scale.set(-0.3, 0.3);
            enemy.sprite.x = this.screenWidth / 10 * (i+6);
            enemy.sprite.y = this.screenHeight / 2;
            this.enemies.push(enemy);
            this.addChild(enemy.sprite);
        }
        
        this.on("changedTarget", this.onChangedTarget, this);
         
    }
    private onChangedTarget(): void {
        console.log("BattleScene", this.lastClicked);
        if (this.lastClicked < this.allyCount){
            this.state = State.clickedAlly;
        }else{
            this.state = State.clickedEnemy;
        }
        console.log(this.state);
    }
}
