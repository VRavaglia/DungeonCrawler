import { Application} from 'pixi.js'
import { ScnBattle } from './scenes/ScnBattle';
import { GameState } from './GameState';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480,
	resizeTo: window
});

let gameState: GameState = new GameState(2, 4);

const scnBattle: ScnBattle = new ScnBattle(app.screen.width, app.screen.height, gameState);

app.stage.addChild(scnBattle)