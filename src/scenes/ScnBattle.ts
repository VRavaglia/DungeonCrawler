import { Container, Ticker } from "pixi.js";
import { BattleCharacter } from './../units/BattleCharacter';
import { GameState } from './../GameState';
import {AttackMenu} from './../menus/AttackMenu';
import { CombatEngine } from "../engines/CombatEngine";
import { AnimationEngine } from "../engines/AnimationEngine";

const enum BattleState{
    waiting,
    clickedAlly,
    clickedEnemy,
    selectingTarget
};

export class ScnBattle extends Container {
    public readonly screenWidth: number;
    public readonly screenHeight: number;
    
    private allies: BattleCharacter[];
    private enemies: BattleCharacter[];

    public lastClicked: number = -1;
    public source: number = -1;
    public target: number = -1;
    
    private state: BattleState;
    private allyCount : number;
    private enemyCount : number;

    private atkMenu: AttackMenu;
    private cEngine: CombatEngine;
    private aEngine: AnimationEngine;

    constructor(screenWidth: number, screenHeight: number, gameState: GameState) {
        super();

        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.allies = [];
        this.enemies = [];
        this.state = BattleState.waiting;
        this.allyCount = gameState.allies;
        this.enemyCount = gameState.enemies;

        this.initializeAllies();
        this.initializeEnemies();
    
        this.on("changedTarget", this.onChangedTarget, this);
        this.on("atkBttn", this.onAttack, this);
        this.on("characterDeath", this.onCharacterDeath, this);

        this.atkMenu = new AttackMenu(this, screenWidth, screenHeight);
        this.cEngine = new CombatEngine();
        this.aEngine = new AnimationEngine();

        Ticker.shared.add(this.update, this);
         
    }

    private update(deltaTime: number): void {
        this.aEngine.update(deltaTime/60);

        this.children.sort(function(a,b){
            if (a.zIndex > b.zIndex) return 1;
            if (a.zIndex < b.zIndex) return -1;
            if (a.position.x < b.position.x) return 1;
            if (a.position.x > b.position.x) return -1;
            return 0;
        });
    }

    private initializeAllies(){
        for(var i = 0; i < this.allyCount; i++) {
            let hp_dmg = [10, 2];
            let x = this.screenWidth / 10 * (i+1);
            let y = this.screenHeight / 2;
            let pos = [x, y];

            let ally = new BattleCharacter(this, i, hp_dmg, pos);
            ally.sprite.anchor.set(0.5, 0.5);
            ally.sprite.scale.set(0.3, 0.3);          

            this.allies.push(ally);

            let sprites = ally.getSprites();

            for(let j = 0; j < sprites.length; j++){
                this.addChild(sprites[j]);
            }
        }
    }

    private initializeEnemies(){
        for(var i = 0; i < this.enemyCount; i++) {
            let hp_dmg = [10, 2];
            let x = this.screenWidth / 10 * (i+6);
            let y = this.screenHeight / 2;
            let pos = [x, y]
            let enemy = new BattleCharacter(this, i+this.allyCount, hp_dmg, pos);
            enemy.sprite.anchor.set(0.5, 0.5);
            enemy.sprite.scale.set(-0.3, 0.3);
            
            this.enemies.push(enemy);
            let sprites = enemy.getSprites();

            for(let j = 0; j < sprites.length; j++){
                this.addChild(sprites[j]);
            }
        }
    }

    private onChangedTarget(): void {

        if(this.aEngine.isRunning()){
            return
        }     
        
        if (this.lastClicked < this.allyCount){
            if (this.state != BattleState.selectingTarget){
                this.state = BattleState.clickedAlly;
                let sprites = this.atkMenu.allSprites();
                for(let i = 0; i < sprites.length; i++){
                    this.addChild(sprites[i]);
                }
                this.source = this.lastClicked;
            }         
        }else{
            if(this.state == BattleState.clickedAlly || this.state == BattleState.selectingTarget){
                let sprites = this.atkMenu.allSprites();
                for(let i = 0; i < sprites.length; i++){
                    this.removeChild(sprites[i]);
                }

                this.target = this.lastClicked - this.allyCount;
                
                if (this.state == BattleState.selectingTarget){
                    this.cEngine.attack(this.allies[this.source], [this.enemies[this.target]]);
                    this.aEngine.attack(this.allies[this.source], [this.enemies[this.target]]);
                }
            }
          
            this.state = BattleState.clickedEnemy;                 
        }
    }
    private onAttack(): void{
        this.state = BattleState.selectingTarget;
    }

    private onCharacterDeath(): void{
        for (let i = 0; i < this.allies.length; i++){
            if(this.allies[i].hp <= 0){
                let sprites = this.allies[i].getSprites();
                for(let j = 0; j < sprites.length; j++){
                    this.removeChild(sprites[j]);
                }           
            }
        }
        for (let i = 0; i < this.enemies.length; i++){
            if(this.enemies[i].hp <= 0){
                let sprites = this.enemies[i].getSprites();
                for(let j = 0; j < sprites.length; j++){
                    this.removeChild(sprites[j]);
                }    
            }
        }
    }
}
