class Hud extends GameObject {
    #grd;
    #currentAction;

    get currentAction() { return this.#currentAction };
    set currentAction(value) {
        if (value instanceof GameAction) {
            if (this.#currentAction)
                this.#currentAction.stop();

            this.#currentAction = value;
        } else if (value == null) {
            this.#currentAction = null;
        }
    }

    constructor(ctx) {
        super();

        this.#grd = ctx.createLinearGradient(0, 0,
            GameContext.engine.background.width, 0);

        this.#grd.addColorStop(1, "rgba(0,0,0,1)");
        this.#grd.addColorStop(0, 'rgba(0,0,0,0)');

        this.syncable = false;

    }

    drawSection(ctx, name, x, y, width, height) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 10, y);
        ctx.stroke();
        ctx.closePath();

        let txtWidth = drawStrokedTextAbs(ctx, name, x + 20, y + 4, 12);
        let endPoint = width - (x + 10 + txtWidth);

        ctx.beginPath();
        ctx.moveTo(x + 30 + txtWidth, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();
    }


    renderAStarMap(ctx, map) {
        let cellSize = 20;

        let absX = 31;
        let absY = 1600;

        for (let node of map) {
            ctx.fillStyle = node.walkable ? '#ffffff' : '#333333'; // Biały dla wolnych, szary dla przeszkód
            CTX.drawRect(
                absX + node.x * cellSize,
                absY + node.y * cellSize,
                cellSize,
                cellSize);
        }
    }

    renderAStarGrid(ctx, grid) {
        if (!grid) return;

        ctx.strokeStyle = 'rgba(255,255,0,0.4)';
        ctx.lineWidth = 1;
        for (let i = 0; i < grid.length; i++) {
            let nodeX = GameContext.engine.aStrPthFnd.trX((grid[i]).x);
            let nodeY = GameContext.engine.aStrPthFnd.trY((grid[i]).y);

            CTX.strokeRect(
                nodeX - CONSTS.GFX.TILE_SIZE / 2,
                nodeY - CONSTS.GFX.TILE_SIZE / 2,
                CONSTS.GFX.TILE_SIZE,
                CONSTS.GFX.TILE_SIZE
            );

            if (!grid[i].walkable) {
                ctx.fillStyle = 'rgba(255,255,0,0.4)';
                CTX.drawRect(
                    nodeX - CONSTS.GFX.TILE_SIZE / 2,
                    nodeY - CONSTS.GFX.TILE_SIZE / 2,
                    CONSTS.GFX.TILE_SIZE,
                    CONSTS.GFX.TILE_SIZE
                );
            }
        }
    }

    update(ctx, objects) {

        /*ctx.globalAlpha = 0.5;

        if (GameContext.debug) {
            let text = `x: ${GameContext.inputManager.mousePosX}` +
                ` y: ${GameContext.inputManager.mousePosY}` +
                ` fps: ${GameContext.engine.fps}`;

            drawStrokedText(ctx, text, 10, 25);
        }


        // Fill with gradient
        ctx.fillStyle = this.#grd;

        CTX.drawRect(0, 740,
            GameContext.engine.background.width,
            GameContext.engine.background.height - 740);

        let sel = Selection.instance.currentSelection;

        this.drawSection(ctx, "info", 68, 740, 330, 205);
        this.drawSection(ctx, "actions", 405, 740, 330, 205);
        if (sel) {
            let player = sel.owner;
            let kills = sel.kills;

            drawStrokedText(ctx, sel.name, 70, 770);

            if (player)
                drawStrokedText(ctx, player.name, 70, 800, 20);

            if (Number.isInteger(kills))
                drawStrokedText(ctx, `kills: ${kills}`, 70, 830, 20);

            drawHpStripe(ctx, sel.maxHp, sel.hp, 70, 920, 325, 20, true);

            let actionsList = sel.getProperty(Building.ACTIONS_PROPERY);
            if (actionsList) {
                actionsList.forEach(element => {
                    ctx.globalAlpha = 1;
                    element.draw(ctx);
                    ctx.globalAlpha = 0.5;
                });
            }
        }

        ctx.globalAlpha = 1;

        */

        ctx.fillStyle = this.#grd;
        this.drawSection(ctx, "menu", CTX.trX(1550), CTX.trY(1880), CTX.trX(740), CTX.trHeight(280));

        let sel = Selection.instance.currentSelection;
        if (sel) {
            let actionsList = sel.getProperty(Building.ACTIONS_PROPERY);
            if (actionsList) {
                actionsList.forEach(element => {
                    ctx.globalAlpha = 1;
                    element.draw(ctx);
                    ctx.globalAlpha = 0.5;
                });
            }
        }
        ctx.globalAlpha = 1;

        drawStrokedText(ctx, "Your Salvage: " + GameContext.getCurrentPlayer().score, 2348, 2016, 20);

        if (CONSTS.DEBUG) {
            this.renderAStarMap(ctx, GameContext.engine.aStrPthFnd.map);
        }

        if (CONSTS.DEBUG && CONSTS.SHOW_GRID_CLIENT) {
            this.renderAStarGrid(ctx, GameContext.engine.aStrPthFnd.map);
        }
    }

    notify(inputEvent) {
        if (inputEvent.type == MouseEventType.MOUSE_DOWN) {
            let sel = Selection.instance.currentSelection;
            if (sel) {
                let actionsList = sel.getProperty(Building.ACTIONS_PROPERY);
                if (actionsList) {
                    actionsList.forEach(element => {
                        if (element.notify) {
                            element.notify(inputEvent);
                            return false;
                        }
                    });
                }
            }
        } else if (inputEvent.type == MouseEventType.MOUSE_UP) {
            if (this.currentAction) {
                this.currentAction.mouseUp();
            }
        } else if (inputEvent.type == MouseEventType.MOUSE_RIGHT_CLICK) {
            if (CONSTS.DEBUG) {
                if (GameContext.engine.continue) {
                    Network.instance.sendStopGame();
                } else {
                    Network.instance.sendResumeGame();
                }
            }
        }

        return true;
    }

    get Y() {
        return 740;
    }

}