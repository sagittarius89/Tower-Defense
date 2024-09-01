class GameEngine {
    #ctx;
    #objects;
    #camera;

    #fps;
    #lastLoop;
    #counter;
    #end;

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
            case 'Wall': {
                let obj = Wall.fromDTO(dto);
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

    endGame(playerName) {
        this.continue = false;
        this.#end = true;

        this.playerWon = playerName;
        Network.instance.closeConnection();
    }

    update(ctx, objects) {
        ctx.fillStyle = "rgb(0, 0, 0, 0)";
        ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        CTX.clearCanvas();


        objects.foreach((obj) => {
            if (obj.x && obj.y
                && (obj.x > GraphicsContextWrapper.WIDTH ||
                    obj.y > GraphicsContextWrapper.HEIGHT ||
                    obj.x < 0 || obj.y < 0)
            ) {
                objects.delete(obj);
                return;
            }
        });


        if (this.continue) {
            objects.foreach((obj) => {
                obj.logic(objects);
            });
        }

        if (this.#end) {
            return;
        }

        this.#counter++;

        if (this.#counter == 60) {
            let thisLoop = new Date();
            let thisFrameTime = thisLoop.getTime() - this.#lastLoop.getTime();
            this.#fps = thisFrameTime;
            this.#lastLoop = new Date();

            this.#counter = 0;
        }

        setTimeout(function () {
            this.update(this.#ctx, this.#objects);
        }.bind(this), CONSTS.FRAME_RATE);
    }

    updateSingleFrame() {
        this.#objects.foreach((obj) => {
            obj.update(this.#ctx, this.#objects);
        });

        if (this.#end) {
            drawStrokedText(this.ctx, `Player ${this.playerWon} wins!`,
                GraphicsContextWrapper.WIDTH / 2, GraphicsContextWrapper.HEIGHT / 2, 40);
            drawStrokedText(this.ctx, `Press F5 to play again.`,
                GraphicsContextWrapper.WIDTH / 2, GraphicsContextWrapper.HEIGHT / 2 + 150, 40);

            return;
        }


        // Draw mouse position at (0, 0)
        if (CONSTS.DEBUG) {
            drawStrokedText(this.#ctx, `Mouse: (${GameContext.inputManager.mousePosX}, ${GameContext.inputManager.mousePosY})`, 150, 150, 15);
            drawStrokedText(this.#ctx, `Mouse: (${CTX.trAbsX(GameContext.inputManager.mousePosX)}, ${CTX.trAbsY(GameContext.inputManager.mousePosY)})`, 150, 200, 15);
        }

        window.requestAnimationFrame(function () {
            this.updateSingleFrame(this.#ctx, this.#objects);
        }.bind(this));
    }

    updateAStarMap() {
        this.aStrPthFnd.refreshMap(this.#objects);

        setTimeout(function () {
            this.updateAStarMap();
        }.bind(this), 100);
    }

    start() {
        this.continue = true;

        window.requestAnimationFrame(function () {
            this.updateSingleFrame();
        }.bind(this));


        setTimeout(function () {
            this.update(this.#ctx, this.#objects);
        }.bind(this), CONSTS.FRAME_RATE);

        setTimeout(function () {
            this.updateAStarMap();
        }.bind(this), 16);
    }

    stop() {
        this.continue = false;
    }

    resume() {
        this.continue = true;
    }
}
