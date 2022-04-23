import { AnimTypes, BattleCharacter } from "../units/BattleCharacter";

export class AnimationEngine{
    private remainingTime: number = 0;
    private animsRunning: BattleCharacter[] = [];
    public attack(source: BattleCharacter, targets: BattleCharacter[]){
        source.playAnim(AnimTypes.attack);
        targets[0].playAnim(AnimTypes.defend);
        this.remainingTime = 1;
        this.animsRunning = [source, targets[0]];
    }
    public update(deltaTime: number){
        let lastFrame: Boolean = this.isRunning();

        this.remainingTime = Math.max(this.remainingTime - deltaTime, 0);

        if (lastFrame && !this.isRunning()){
            this.finishAnimation();
            
        }
    }
    public isRunning(){
        return this.remainingTime > 0;
    }
    private finishAnimation(){
        for(let i = 0; i < this.animsRunning.length; i++){
            this.animsRunning[i].playAnim(AnimTypes.stand);
        }
    }
}

