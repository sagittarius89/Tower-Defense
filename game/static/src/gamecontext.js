var GameContext = (async function () {

    while (!ResourceManager.instance.isReady()) {
        await sleep(100);
    }

    GameContext.canvas = document.getElementById("canvas");
    GameContext.canvas.width = document.body.clientWidth - 15;
    GameContext.canvas.height = document.body.clientHeight - 15;

    GameContext.engine = new GameEngine(GameContext.canvas.getContext("2d"));
    GameContext.inputManager = new InputManager();
    GameContext.player1 = new Player("Player 1");

    GameContext.mouseInput = new Mouse();
    GameContext.inputManager.attachPlayer(GameContext.player1, GameContext.mouseInput);
    GameContext.engine.addObject(GameContext.inputManager);

    GameContext.player2 = new Player("Player 2");

    //roof
    //GameContext.engine.addObject(new Surface(new Vector2d(0, 0), GameContext.engine.WIDTH, Orientation.HORIZONTAL));

    //floor
    //GameContext.engine.addObject(new Surface(new Vector2d(0, GameContext.engine.HEIGHT), GameContext.engine.WIDTH, Orientation.HORIZONTAL));

    //left wall
    //GameContext.engine.addObject(new Surface(new Vector2d(0, 0), GameContext.engine.HEIGHT, Orientation.VERTICAL));

    //right wall
    //GameContext.engine.addObject(new Surface(new Vector2d(GameContext.engine.WIDTH - 10, 0), GameContext.engine.HEIGHT, Orientation.VERTICAL));

    GameContext.engine.addObject(new World());

    let buildingA = new CommandCenterBuilding("tower_02",
        new Vector2d(60, 320),
        new Vector2d(410, 420)
    );

    buildingA.addProperty(InputManager.INPUT_LISTENER_PROPERTY, GameContext.player1);
    buildingA.addProperty(Player.PLAYER_PROPERTY, GameContext.player1);
    GameContext.engine.addObject(buildingA);
    buildingA.produceNewSoldier();

    let buildingB = new CommandCenterBuilding("tower_01",
        new Vector2d(1100, 290),
        new Vector2d(1080, 400)
    );
    buildingB.addProperty(InputManager.INPUT_LISTENER_PROPERTY, GameContext.player2);
    buildingB.addProperty(Player.PLAYER_PROPERTY, GameContext.player2);

    GameContext.engine.addObject(buildingB);
    buildingB.produceNewSoldier();


    //GameContext.playerBall = null;
    //GameContext.engine.addObject(GameContext.playerBall = new PlayerBall(GameContext.canvas.width / 2, GameContext.canvas.height / 2, "red", GameContext.player));

    //GameContext.engine.camera.attachToObject(GameContext.playerBall);

    GameContext.engine.addObject(GameContext.inputManager);

    GameContext.engine.start();
}());