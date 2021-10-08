var GameContext = (async function () {

    while (!ResourceManager.instance.isReady()) {
        await sleep(100);
    }

    GameContext.debug = false;
    GameContext.canvas = document.getElementById("canvas");
    GameContext.canvas.width = document.body.clientWidth - 15;
    GameContext.canvas.height = document.body.clientHeight - 15;

    GameContext.engine = new GameEngine(GameContext.canvas.getContext("2d"));
    GameContext.inputManager = new InputManager();
    GameContext.player1 = Player.player1;

    GameContext.mouseInput = new Mouse();
    GameContext.inputManager.attachPlayer(GameContext.player1, GameContext.mouseInput);
    GameContext.engine.addObject(GameContext.inputManager);

    GameContext.player2 = Player.player2;

    //roof
    //GameContext.engine.addObject(new Surface(new Vector2d(0, 0), GameContext.engine.WIDTH, Orientation.HORIZONTAL));

    //floor
    //GameContext.engine.addObject(new Surface(new Vector2d(0, GameContext.engine.HEIGHT), GameContext.engine.WIDTH, Orientation.HORIZONTAL));

    //left wall
    //GameContext.engine.addObject(new Surface(new Vector2d(0, 0), GameContext.engine.HEIGHT, Orientation.VERTICAL));

    //right wall
    //GameContext.engine.addObject(new Surface(new Vector2d(GameContext.engine.WIDTH - 10, 0), GameContext.engine.HEIGHT, Orientation.VERTICAL));

    GameContext.engine.background = new World();
    GameContext.engine.addObject(GameContext.engine.background);

    let buildingA = new CommandCenterBuilding(
        new Vector2d(67, 425),
        new Vector2d(73, 440),
        "tower_violet_01",
        "towerlight_violet_01",
        "solider_violet_01",
        "bullet_violet_01"
    );

    buildingA.addProperty(InputManager.INPUT_LISTENER_PROPERTY, GameContext.player1);
    buildingA.addProperty(Player.PLAYER_PROPERTY, GameContext.player1);
    GameContext.engine.addObject(buildingA);
    buildingA.produceNewSoldier();

    let buildingB = new CommandCenterBuilding(
        new Vector2d(1356, 435),
        new Vector2d(1292, 460),
        "tower_orange_01",
        "towerlight_orange_01",
        "solider_oragne_01",
        "bullet_orange_01"
    );
    buildingB.addProperty(InputManager.INPUT_LISTENER_PROPERTY, GameContext.player2);
    buildingB.addProperty(Player.PLAYER_PROPERTY, GameContext.player2);

    GameContext.engine.addObject(buildingB);
    buildingB.produceNewSoldier();


    //GameContext.playerBall = null;
    //GameContext.engine.addObject(GameContext.playerBall = new PlayerBall(GameContext.canvas.width / 2, GameContext.canvas.height / 2, "red", GameContext.player));

    //GameContext.engine.camera.attachToObject(GameContext.playerBall);

    GameContext.engine.addObject(GameContext.inputManager);

    GameContext.hud = new Hud(GameContext.canvas.getContext("2d"));
    GameContext.engine.addObject(GameContext.hud);

    GameContext.engine.start();
}());