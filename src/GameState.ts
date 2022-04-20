

export class GameState{
    public readonly allies: number;
    public readonly enemies: number;

    constructor(allies: number, enemies: number) {
        this.allies = allies;
        this.enemies = enemies;
    }
}