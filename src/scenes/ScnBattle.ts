import { Container } from "pixi.js";
import { BattleCharacter } from './../units/BattleCharacter';
import { GameState } from './../GameState';
import {AttackMenu} from './../menus/AttackMenu';
import { CombatEngine } from "../combat/CombatEngine";
import { HpBar } from "../menus/HpBar";

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

        this.initializeAllies();
        this.initializeEnemies();
    
        this.on("changedTarget", this.onChangedTarget, this);
        this.on("atkBttn", this.onAttack, this);
        this.on("characterDeath", this.onCharacterDeath, this);

        this.atkMenu = new AttackMenu(this, screenWidth, screenHeight);
        this.cEngine = new CombatEngine();
         
    }
    private initializeAllies(){
        for(var i = 0; i < this.allyCount; i++) {
            let hp_dmg = [10, 2];
            let x = this.screenWidth / 10 * (i+1);
            let y = this.screenHeight / 2;
            let pos = [x, y];

            let ally = new BattleCharacter("./units/crusader.png", this, i, hp_dmg, pos);
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
            let enemy = new BattleCharacter("./units/crusader.png", this, i+this.allyCount, hp_dmg, pos);
            enemy.sprite.anchor.set(0.5, 0.5);
            enemy.sprite.scale.set(-0.3, 0.3);
            
            this.enemies.push(enemy);
            this.addChild(enemy.sprite);

            let hpBar = new HpBar(x, y*2/5, hp_dmg[0]);
            let hpSprites = hpBar.getSprites();

            for(let j = 0; j < hpSprites.length; j++){
                this.addChild(hpSprites[j]);
            }
        }
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
