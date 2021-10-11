var createGameContext = (async function (player1, player2) {
    this.debug = false;

    this.engine = new GameEngine(this.canvas.getContext("2d"));
    this.inputManager = new InputManager();
    this.player1 = player1;

    this.mouseInput = new Mouse();
    this.inputManager.attachPlayer(this.player1, this.mouseInput);
    this.engine.addObject(this.inputManager);

    this.player2 = player2;

    this.engine.background = new World();
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

    buildingA.addProperty(InputManager.INPUT_LISTENER_PROPERTY, this.player1);
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
    buildingB.addProperty(InputManager.INPUT_LISTENER_PROPERTY, this.player2);

    this.engine.addObject(buildingB);
    buildingB.produceNewSoldier();

    this.engine.addObject(this.inputManager);

    this.hud = new Hud(this.canvas.getContext("2d"));
    this.hud.addProperty(InputManager.INPUT_LISTENER_PROPERTY, this.player1);
    this.engine.addObject(this.hud);

    this.engine.setWaitingForPlayersState();
});