class GameAction extends GameObject {
    #callback;
    #buildingList;
    #player;
    #lock;

    get callback() { return this.#callback; }

    constructor(callback) {
        super();

        this.#callback = callback;
    }

    set player(value) {
        this.#player = value;
    }

    get player() {
        return this.#player;
    }

    set lock(value) {
        this.#lock = value;
    }

    get lock() {
        return this.#lock;
    }

    findClostestBuilding(objects, w, h) {
        this.#buildingList = [];

        //if (GameContext.inputManager.mousePosY + 65 > GameContext.hud.Y) {
        //    this.#lock = true;
        //    return;
        //}



        this.#lock = GameContext.engine.aStrPthFnd.checkObjsObjCollision(objects,
            new SquareObject(
                w,
                h,
                CTX.trAbsX(GameContext.inputManager.mousePosX),
                CTX.trAbsY(GameContext.inputManager.mousePosY)
            )
        );

        if (this.#lock) return;

        let hasBuilding = false;
        objects.foreach((obj) => {
            if (obj instanceof Building) {
                let player = obj.owner;

                if (player.name == this.#player.name) {
                    this.#buildingList.push(obj);

                    let objPos = new Vector2d(obj.x, obj.y);
                    let myPos = new Vector2d(
                        CTX.trAbsX(GameContext.inputManager.mousePosX),
                        CTX.trAbsY(GameContext.inputManager.mousePosY)
                    );
                    var distance = myPos.getDistance(objPos);

                    hasBuilding = distance < CONSTS.TOWER.BUILDING_DISTANCE || hasBuilding;
                }
            }
        });

        this.#lock = !hasBuilding;
    }

    drawBuildingZone(ctx) {
        this.#buildingList.forEach(b => {
            let objPos = new Vector2d(b.x, b.y);


            ctx.fillStyle = 'yellow';

            ctx.beginPath();
            ctx.arc(
                CTX.trX(objPos.x),
                CTX.trY(objPos.y),
                CTX.trX(CONSTS.TOWER.BUILDING_DISTANCE), 0, 2 * Math.PI);

            ctx.fill();
            ctx.closePath();
        });
    }

    stop() {
        GameContext.engine.objects.delete(this);
        GameContext.hud.currentAction = null;
    }

    mouseUp() {
        this.#callback();
    }

    update(ctx, objects) {
        //nothing to do
    }
}