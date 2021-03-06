class GameEngine {
    #ctx;
    #objects;
    #camera;

    #fps;
    #lastLoop;
    #counter;

    /** @param {CanvasRenderingContext2D} ctx */
    constructor(ctx) {
        /** @member {CanvasRenderingContext2D} */
        this.#ctx = ctx;

        /** @member {GameObjectList} */
        this.#objects = new GameObjectList();
        this.#camera = new Camera(new Vector2d(0, 0));

        this.addObject(this.#camera);

        this.#lastLoop = new Date();
        this.#counter = 0;
        this.#fps = 0;
    }

    get ctx() { return this.#ctx; }
    get fps() { return (1000 / this.#fps * 60).toFixed(1); }

    /**
     * 
     * @param {GameObject} object 
     */
    addObject(object) {
        this.#objects.push(object);
    }

    addFromDTO(dto) {
        switch (dto.type) {
            case 'Soldier': {
                let obj = Soldier.fromDTO(dto);
                obj.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
                    obj.owner);
                this.addObject(obj);
                break;
            }
            case 'Tower': {
                let obj = Tower.fromDTO(dto);
                obj.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
                    obj.owner);
                this.addObject(obj);
                break;
            }
            case 'Bullet': {
                let obj = Bullet.fromDTO(dto);
                this.addObject(obj);
                break;
            }
            case 'BlackHole': {
                let obj = BlackHole.fromDTO(dto);
                obj.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
                    obj.owner);
                this.addObject(obj);
            }
        }
    }

    get objects() { return this.#objects; }

    get WIDTH() { return this.ctx.canvas.width }
    get HEIGHT() { return this.ctx.canvas.height; }

    get camera() { return this.#camera; }
    set camera(camera) {
        this.#objects.delete(this.#camera);
        this.#camera = camera;

        addObject(this.#camera);
    }

    endGame(ctx, hasPlayer1Objects, hasPlayer2Objects) {

        setTimeout(function () {
            this.continue = false;
            let text = '';
            if (hasPlayer1Objects && !hasPlayer2Objects) {
                text = `${GameContext.player1.name} wins`;
            } else if (!hasPlayer1Objects && hasPlayer2Objects) {
                text = `${GameContext.player2.name} wins`;
            } else {
                text = `Draw!`;
            }

            drawStrokedText(ctx, text, this.background.width / 2, this.background.height / 2, 40);
        }.bind(this), 1000);
    }

    checkWin(ctx, objects) {
        let hasPlayer1Objects = false;
        let hasPlayer2Objects = false;

        objects.foreach(element => {
            if (element instanceof Building || element instanceof Soldier) {
                let player = element.owner;
                if (player) {
                    if (player.name == GameContext.player1.name) {
                        hasPlayer1Objects = true;
                    } else if (player.name == GameContext.player2.name) {
                        hasPlayer2Objects = true;
                    }
                }
            }
        });

        if (!hasPlayer1Objects || !hasPlayer2Objects) {
            this.endGame(ctx, hasPlayer1Objects, hasPlayer2Objects);
        }
    }

    update(ctx, objects) {
        ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        objects.foreach((obj) => {
            if (obj.x && obj.y
                && (obj.x > GameContext.engine.background.width ||
                    obj.y > GameContext.engine.background.height ||
                    obj.x < 0 || obj.y < 0)
            ) {
                objects.delete(obj);
                return;
            }

            obj.update(ctx, objects);
        });

        objects.foreach((obj) => {
            obj.logic(objects);
        });

        this.checkWin(ctx, objects);

        this.#counter++;

        if (this.#counter == 60) {
            let thisLoop = new Date();
            let thisFrameTime = thisLoop.getTime() - this.#lastLoop.getTime();
            this.#fps = thisFrameTime;
            this.#lastLoop = new Date();

            this.#counter = 0;
        }

        if (this.continue)
            window.requestAnimationFrame(function () {
                this.update(this.#ctx, this.#objects);
            }.bind(this));
    }

    updateSingleFrame() {
        window.requestAnimationFrame(function () {
            this.update(this.#ctx, this.#objects);
        }.bind(this));
    }

    start() {
        this.continue = true;

        window.requestAnimationFrame(function () {
            this.update(this.#ctx, this.#objects);
        }.bind(this));
    }

    stop() {
        this.continue = false;
    }
}
