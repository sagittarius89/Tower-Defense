var createGameContext = (async function (
    player1,
    player2,
    buildingA,
    buildingB,
    objList
) {


    GameContext = this;
    this.debug = true;
    this.engine = new GameEngine(this.canvas.getContext("2d"));
    this.inputManager = new InputManager();
    this.player1 = player1;
    this.player2 = player2;

    this.mouseInput = new Mouse();
    this.inputManager.attachPlayer(
        this.player1.self ? player1 : player2,
        this.mouseInput);

    this.engine.addObject(this.inputManager);

    //Command Centers
    buildingA.addProperty(InputManager.INPUT_LISTENER_PROPERTY, this.player1);
    this.engine.addObject(buildingA);

    buildingB.addProperty(InputManager.INPUT_LISTENER_PROPERTY, this.player2);
    this.engine.addObject(buildingB);



    objList.forEach(obj => {
        switch (obj.type) {
            case 'Soldier':
                obj.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
                    this.getProperty(InputManager.INPUT_LISTENER_PROPERTY));

                this.engine.addObject(obj);

                break;
            case 'World':
                this.engine.background = obj;
                this.engine.addObject(obj);
                break;
        }
    });

    //Hud
    this.hud = new Hud(this.canvas.getContext("2d"));
    this.hud.addProperty(InputManager.INPUT_LISTENER_PROPERTY, this.player1);
    this.engine.addObject(this.hud);
});

var GameContext = null;