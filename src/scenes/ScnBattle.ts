import { Container } from "pixi.js";
import { BattleCharacter } from './../units/BattleCharacter';
import { GameState } from './../GameState';
import {AttackMenu} from './../menus/AttackMenu';
import { CombatEngine } from "../combat/CombatEngine";

enum State{
    waiting,
    clickedAlly,
    clickedEnemy,
    selectingTarget
};

export class ScnBattle extends Container {
    private readonly screenWidth: number;
    private readonly screenHeight: number;
    
    private allies: BattleCharacter[];
    private enemies: BattleCharacter[];

    public lastClicked: number = -1;
    public source: number = -1;
    public target: number = -1;
    
    private state: State;
    private allyCount : number;
    private enemyCount : number;

    private atkMenu: AttackMenu;
    private cEngine: CombatEngine;

    constructor(screenWidth: number, screenHeight: number, gameState: GameState) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.allies = [];
        this.enemies = [];
        this.state = State.waiting;
        this.allyCount = gameState.allies;
        this.enemyCount = gameState.enemies;

        for(var i = 0; i < this.allyCount; i++) {
            let ally = new BattleCharacter("./units/crusader.png", this, i, [10, 2]);
            ally.sprite.anchor.set(0.5, 0.5);
            ally.sprite.scale.set(0.3, 0.3);
            ally.sprite.x = this.screenWidth / 10 * (i+1);
            ally.sprite.y = this.screenHeight / 2;
            this.allies.push(ally);
            this.addChild(ally.sprite);
        }

        for(var i = 0; i < this.enemyCount; i++) {
            let enemy = new BattleCharacter("./units/crusader.png", this, i+this.allyCount, [10, 2]);
            enemy.sprite.anchor.set(0.5, 0.5);
            enemy.sprite.scale.set(-0.3, 0.3);
            enemy.sprite.x = this.screenWidth / 10 * (i+6);
            enemy.sprite.y = this.screenHeight / 2;
            this.enemies.push(enemy);
            this.addChild(enemy.sprite);
        }
        
        this.on("changedTarget", this.onChangedTarget, this);
        this.on("atkBttn", this.onAttack, this);
        this.on("characterDeath", this.onCharacterDeath, this);

        this.atkMenu = new AttackMenu(this, screenWidth, screenHeight);
        this.cEngine = new CombatEngine();
         
    }
    private onChangedTarget(): void {
        console.log("BattleScene", this.lastClicked);
        
        if (this.lastClicked < this.allyCount){
            if (this.state != State.selectingTarget){
                this.state = State.clickedAlly;
                let sprites = this.atkMenu.allSprites();
                for(let i = 0; i < sprites.length; i++){
                    this.addChild(sprites[i]);
                }
                this.source = this.lastClicked;
            }         
        }else{
            if(this.state == State.clickedAlly || this.state == State.selectingTarget){
                let sprites = this.atkMenu.allSprites();
                for(let i = 0; i < sprites.length; i++){
                    this.removeChild(sprites[i]);
                }

                this.target = this.lastClicked - this.allyCount;
                
                if (this.state == State.selectingTarget){
                    this.cEngine.attack(this.allies[this.source], [this.enemies[this.target]]);
                }
            }
          
            this.state = State.clickedEnemy;                 
        }
        console.log(this.state);
    }
    private onAttack(): void{
        this.state = State.selectingTarget;
        console.log(this.state);
    }

    private onCharacterDeath(): void{
        for (let i = 0; i < this.allies.length; i++){
            if(this.allies[i].hp <= 0){
                this.removeChild(this.allies[i].sprite);
            }
        }
        for (let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].hp <= 0){
                this.removeChild(this.enemies[i].sprite);
            }
        }
    }
}
