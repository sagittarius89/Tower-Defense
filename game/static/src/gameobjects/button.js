class Button extends SquareObject {
    #action;
    #args;
    #icon;
    #onlyIcon;
    #cost;
    #player;
    #cooldown;
    #lastUse;
    #locked;

    constructor(name, action, args, x, y, width, height,
        icon = null, cooldown = 0, cost = 0, onlyIcon = false,
        player = Player.player1) {

        super(width, height, x + width / 2, y + height / 2);

        let tmpImg = ResourceManager.instance.getImageResource(icon);

        this.#icon = tmpImg;
        this.#cost = cost;
        this.name = name;
        this.#action = action;
        this.#onlyIcon = onlyIcon;
        this.#player = player;
        this.#args = args;
        this.#cooldown = cooldown;
        this.#lastUse = (new Date().getTime()) - (cooldown * 1000)
        this.#locked = false;

        this.selectable = false;
        this.syncable = false;
    }

    draw(ctx) {
        let now = new Date().getTime();
        let diff = now - this.#lastUse;

        ctx.setTransform(1, 0, 0, 1, CTX.trX(this.x), CTX.trY(this.y));

        ctx.drawImage(
            this.#icon,
            -CTX.trX(this.width) / 2,
            -CTX.trHeight(this.height) / 2,
            CTX.trX(this.width),
            CTX.trHeight(this.height)
        );

        if (diff < this.#cooldown * 1000) {
            this.#locked = true;

            let timeLast = Number.parseInt(this.#cooldown - (diff / 1000));
            let txtW = mesaureStrokedText(ctx, timeLast, 22);
            let wStart = (CTX.trX(this.width) - txtW) / 2;

            drawStrokedText(ctx, timeLast,
                CTX.trX(-this.width / 2) + wStart,
                CTX.trHeight(-this.height / 2 + this.height * 0.7), 22);
        } else {
            this.#locked = false;
            /*if (!Collider.checkCollisionPointWithSquare(
                new Vector2d(GameContext.inputManager.mousePosX,
                    GameContext.inputManager.mousePosY),
                new Vector2d(CTX.trX(this.toSquare().x), CTX.trY(this.toSquare().y)))
            ) {

            }*/

            ctx.fillStyle = 'rgb(0,0,0,0.25)';
            ctx.fillRect(
                -CTX.trX(this.width) / 2,
                -CTX.trHeight(this.height) / 2,
                CTX.trX(this.width),
                CTX.trHeight(this.height)
            );

            let txtW = mesaureStrokedText(ctx, this.#cost, 22);
            let wStart = (CTX.trX(this.width) - txtW) / 2;

            drawStrokedTextAbs(ctx, this.#cost,
                CTX.trX(-this.width / 2) + wStart,
                CTX.trHeight(-this.height / 2 + this.height * 0.7), 22);
        }

        CTX.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
    }

    notify(inputEvent) {
        if (!this.#locked &&
            GameContext.getCurrentPlayer().score >= this.#cost &&
            inputEvent.type == MouseEventType.MOUSE_DOWN &&
            Collider.checkCollisionPointWithSquare(
                new Vector2d(inputEvent.x, inputEvent.y),
                new Square(
                    CTX.trX(this.x),
                    CTX.trY(this.y),
                    CTX.trX(this.width),
                    CTX.trHeight(this.height)))
        ) {
            let args = this.#args.map(x => x);

            args.unshift(function () {
                this.#lastUse = new Date();
            }.bind(this));

            let action = Reflect.construct(this.#action, args);

            GameContext.hud.currentAction = action;
            GameContext.engine.addObject(action);

            return false;
        }

        return true;
    }

    update(ctx, objects) {
        //nothing to do
    }
}