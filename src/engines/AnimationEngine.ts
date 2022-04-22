import { AnimTypes, BattleCharacter } from "../units/BattleCharacter";

export class AnimationEngine{
    public attack(source: BattleCharacter, targets: BattleCharacter[]){
        source.playAnim(AnimTypes.attack);
        targets[0].playAnim(AnimTypes.defend);    
    }
}

