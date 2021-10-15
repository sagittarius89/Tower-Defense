class GameEngine {
    #objects;

    /** @param {CanvasRenderingContext2D} ctx */
    constructor(ctx) {

        /** @member {GameObjectList} */
        this.#objects = new GameObjectList();
    }

    /**
     * 
     * @param {GameObject} object 
     */
    addObject(object) {
        this.#objects.push(object);
    }

    get objects() { return this.#objects; }

    get WIDTH() { return this.ctx.canvas.width }
    get HEIGHT() { return this.ctx.canvas.height; }

    endGame(hasPlayer1Objects, hasPlayer2Objects, instance) {

        setTimeout(function () {
            instance.continue = false;

            //@todo

        }.bind(this), 1000);
    }

    checkWin(ctx, objects, instance) {
        let hasPlayer1Objects = false;
        let hasPlayer2Objects = false;

        objects.foreach(element => {
            if (element instanceof Building || element instanceof Soldier) {
                let player = element.owner;
                if (player) {
                    if (player == GameContext.player1) {
                        hasPlayer1Objects = true;
                    } else if (player == GameContext.player2) {
                        hasPlayer2Objects = true;
                    }
                }
            }
        });

        if (!hasPlayer1Objects || !hasPlayer2Objects) {
            this.endGame(ctx, hasPlayer1Objects, hasPlayer2Objects, instance);
        }
    }

    update(ctx, objects, collider, camera, instance) {
        objects.foreach((obj) => {
            if (obj.x && obj.y
                && (obj.x > GameContext.engine.background.width ||
                    obj.y > GameContext.engine.background.height ||
                    obj.x < 0 || obj.y < 0)
            ) {
                objects.delete(obj);
                return;
            }
        });

        objects.foreach((obj) => {
            obj.logic(objects);
        });

        this.checkWin(ctx, objects, instance);

        if (instance.continue)
            setTimeout(function () {
                this.update(this.#ctx, this.#objects, this.#collider, this.#camera, this);
            }.bind(this), 1000 / 60);
    }

    start() {
        this.continue = true;

        setTimeout(function () {
            this.update(this.#ctx, this.#objects, this.#collider, this.#camera, this);
        }.bind(this), 1000 / 60);
    }

    stop() {
        this.continue = false;
    }
}
