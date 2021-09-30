const GameContext = (function () {
    this.canvas = document.getElementById("canvas");
    this.canvas.width = document.body.clientWidth - 15;
    this.canvas.height = document.body.clientHeight - 15;

    this.engine = new GameEngine(this.canvas.getContext("2d"));
    this.inputManager = new InputManager();
    this.player = new Player("Player 1");
    //this.keyboardInput = new Keyboard();
    this.inputManager.attachPlayer(this.player, this.keyboardInput);
    this.engine.addObject(this.inputManager);

    //roof
    //this.engine.addObject(new Surface(new Vector2d(0, 0), this.engine.WIDTH, Orientation.HORIZONTAL));

    //floor
    //this.engine.addObject(new Surface(new Vector2d(0, this.engine.HEIGHT), this.engine.WIDTH, Orientation.HORIZONTAL));

    //left wall
    //this.engine.addObject(new Surface(new Vector2d(0, 0), this.engine.HEIGHT, Orientation.VERTICAL));

    //right wall
    //this.engine.addObject(new Surface(new Vector2d(this.engine.WIDTH - 10, 0), this.engine.HEIGHT, Orientation.VERTICAL));

    this.engine.addObject(new World("/resources/images/bg_01.png"));

    //this.playerBall = null;
    //this.engine.addObject(this.playerBall = new PlayerBall(this.canvas.width / 2, this.canvas.height / 2, "red", this.player));

    //this.engine.camera.attachToObject(this.playerBall);

    this.engine.addObject(this.inputManager);

    this.setInterval(() => {


    }, 750);

    this.engine.start();
}());