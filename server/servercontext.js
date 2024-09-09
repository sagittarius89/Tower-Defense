const GameEngine = require('./serverengine');
const World = require('./gameobjects/world');
const CommandCenterBuilding = require('./gameobjects/commandcenterbuilding');
const Spawn = require('./gameobjects/spawnbuilding');
const Type = require("./gameobjects/soldier").Type;
const Vector2d = require('../game/static/src/math/vector').Vector2d;
const AStarPathFinder = require('../shared/astarpathfinder').AStarPathFinder;
const CONSTS = require('../shared/consts').CONSTS;


module.exports = class GameContext {
    constructor(player1, player2, conn) {
        this.debug = false;

        this.engine = new GameEngine(player1, player2, conn);

        this.player1 = player1;
        this.player2 = player2;

        this.engine.background = new World('bg_03');
        this.engine.addObject(this.engine.background);
        this.engine.aStrPthFnd = new AStarPathFinder(CONSTS.GFX.ABS_WIDTH,
            CONSTS.GFX.ABS_HEIGHT, CONSTS.GFX.TILE_SIZE);


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
        //buildingA.produceNewSoldier(this.engine.objects);

        let spawnTankA = new Spawn(
            new Vector2d(CONSTS.SPAWN.TANK.A_POS_X,
                CONSTS.SPAWN.TANK.A_POS_Y),
            new Vector2d(CONSTS.SPAWN.TANK.A_SPAWN_X,
                CONSTS.SPAWN.TANK.A_SPAWN_Y),
            this.player1,
            Type.TANK,
            CONSTS.SPAWN.TANK.A_ANGLE,
            CONSTS.SPAWN.TANK.SPAWN_FREQUENCY,
            "solider_violet_01",
            "bullet_violet_01"
        );

        this.engine.addObject(spawnTankA);
        spawnTankA.produceNewSoldier(this.engine.objects);


        let spawnFighterA = new Spawn(
            new Vector2d(CONSTS.SPAWN.FIGHTER.A_POS_X,
                CONSTS.SPAWN.FIGHTER.A_POS_Y),
            new Vector2d(CONSTS.SPAWN.FIGHTER.A_SPAWN_X,
                CONSTS.SPAWN.FIGHTER.A_SPAWN_Y),
            this.player1,
            Type.FIGHTER,
            CONSTS.SPAWN.FIGHTER.A_ANGLE,
            CONSTS.SPAWN.FIGHTER.SPAWN_FREQUENCY,
            "solider_violet_01",
            "bullet_violet_01"
        );

        this.engine.addObject(spawnFighterA);
        spawnFighterA.produceNewSoldier(this.engine.objects);



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
        //buildingB.produceNewSoldier(this.engine.objects);

        let spawnTankB = new Spawn(
            new Vector2d(CONSTS.SPAWN.TANK.B_POS_X,
                CONSTS.SPAWN.TANK.B_POS_Y),
            new Vector2d(CONSTS.SPAWN.TANK.B_SPAWN_X,
                CONSTS.SPAWN.TANK.B_SPAWN_Y),
            this.player2,
            Type.TANK,
            CONSTS.SPAWN.TANK.B_ANGLE,
            CONSTS.SPAWN.TANK.SPAWN_FREQUENCY,
            "solider_oragne_01",
            "bullet_orange_01"
        );

        let spawnFighterB = new Spawn(
            new Vector2d(CONSTS.SPAWN.FIGHTER.B_POS_X,
                CONSTS.SPAWN.FIGHTER.B_POS_Y),
            new Vector2d(CONSTS.SPAWN.FIGHTER.B_SPAWN_X,
                CONSTS.SPAWN.FIGHTER.B_SPAWN_Y),
            this.player2,
            Type.FIGHTER,
            CONSTS.SPAWN.FIGHTER.B_ANGLE,
            CONSTS.SPAWN.FIGHTER.SPAWN_FREQUENCY,
            "solider_oragne_01",
            "bullet_orange_01"
        );

        this.engine.addObject(spawnFighterB);
        spawnFighterB.produceNewSoldier(this.engine.objects);

        this.engine.addObject(spawnTankB);
        spawnTankB.produceNewSoldier(this.engine.objects);




    }
}