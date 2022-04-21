import { BattleCharacter } from "../units/BattleCharacter";

export class CombatEngine{
    public attack(source: BattleCharacter, targets: BattleCharacter[]){
        for(let i = 0; i < targets.length; i++){

            source.onAttackReceived(targets[i]);
            targets[i].onAttackReceived(source);
            if(targets[i].receiveDamage){
                let damage = source.dmg;
                targets[i].onDamageReceived(damage); 
                source.onDamageDelt(damage);
            }

            targets[i].onEndDamage(); 
            
            console.log("New target hp: ", targets[i].hp);
        }
    }
}

