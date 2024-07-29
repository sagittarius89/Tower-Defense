const GameEngine = require('./serverengine');
const World = require('./gameobjects/world');
const CommandCenterBuilding = require('./gameobjects/commandcenterbuilding');
const Vector2d = require('../game/static/src/math/vector').Vector2d;
const CONSTS = require('../shared/consts').CONSTS;


module.exports = class GameContext {
    constructor(player1, player2, conn) {
        this.debug = false;

        this.engine = new GameEngine(player1, player2, conn);

        this.player1 = player1;
        this.player2 = player2;

        this.engine.background = new World('bg_03');
        this.engine.addObject(this.engine.background);


        let buildingA = new CommandCenterBuilding(
            new Vector2d(CONSTS.COMMAND_CENTER.A_POS_X,
                CONSTS.COMMAND_CENTER.A_POS_Y),
            new Vector2d(CONSTS.COMMAND_CENTER.A_SPAWN_X,
                CONSTS.COMMAND_CENTER.A_SPAWN_Y),
            this.player1,
            "tower_violet_01",
            "towerlight_violet_01",
            "solider_violet_01",
            "bullet_violet_01",
            "turret_violet_01",
            "turretlight_violet_01",
            "black_holeoviolet",
            "black_holeovioletselected"
        );

        this.engine.addObject(buildingA);
        buildingA.produceNewSoldier(this.engine.objects);

        let buildingB = new CommandCenterBuilding(
            new Vector2d(CONSTS.COMMAND_CENTER.B_POS_X,
                CONSTS.COMMAND_CENTER.B_POS_Y),
            new Vector2d(CONSTS.COMMAND_CENTER.B_SPAWN_X,
                CONSTS.COMMAND_CENTER.B_SPAWN_Y),
            this.player2,
            "tower_orange_01",
            "towerlight_orange_01",
            "solider_oragne_01",
            "bullet_orange_01",
            "turret_orange_01",
            "turretlight_orange_01",
            "black_holeoorange",
            "black_holeoorangeselected"
        );

        this.engine.addObject(buildingB);
        buildingB.produceNewSoldier(this.engine.objects);
    }
}