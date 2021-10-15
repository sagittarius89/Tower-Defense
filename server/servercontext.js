const GameEngine = require('serverengine').GameEngine;
const World = require('../game/static/src/gameobjects/world').World;
const CommandCenterBuilding = require('../game/static/src/gameobjects/commandcenterbuilding').CommandCenterBuilding;


class GameContext {
    constructor(player1, player2) {
        this.debug = false;

        this.engine = new GameEngine(this.canvas.getContext("2d"));

        this.player1 = player1;
        this.player2 = player2;

        this.engine.background = new World('bg_03');
        this.engine.addObject(this.engine.background);

        let buildingA = new CommandCenterBuilding(
            new Vector2d(67, 425),
            new Vector2d(73, 440),
            this.player1,
            "tower_violet_01",
            "towerlight_violet_01",
            "solider_violet_01",
            "bullet_violet_01",
            "turret_violet_01",
            "turretlight_violet_01"
        );

        this.engine.addObject(buildingA);
        buildingA.produceNewSoldier();

        let buildingB = new CommandCenterBuilding(
            new Vector2d(1356, 435),
            new Vector2d(1292, 460),
            this.player2,
            "tower_orange_01",
            "towerlight_orange_01",
            "solider_oragne_01",
            "bullet_orange_01",
            "turret_orange_01",
            "turretlight_orange_01"
        );

        this.engine.addObject(buildingB);
        buildingB.produceNewSoldier();
    }
}

module.exports = {
    GameContext
}