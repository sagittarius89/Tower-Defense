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

        ctx.setTransform(1, 0, 0, 1, this.x, this.y);

        ctx.drawImage(
            this.#icon,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );

        if (diff < this.#cooldown * 1000) {
            this.#locked = true;

            let timeLast = Number.parseInt(this.#cooldown - (diff / 1000));
            let txtW = mesaureStrokedText(ctx, timeLast, 30);
            let wStart = (this.width - txtW) / 2;

            drawStrokedText(ctx, timeLast,
                (-this.width / 2) + wStart,
                (-this.height / 2) + this.height * 0.7, 30);
        } else {
            this.#locked = false;
            if (!Collider.checkCollisionPointWithSquare(
                new Vector2d(GameContext.inputManager.mousePosX,
                    GameContext.inputManager.mousePosY),
                this.toSquare())
            ) {
                ctx.fillStyle = 'rgb(0,0,0,0.25)';
                ctx.fillRect(-this.width / 2, -this.height / 2,
                    this.width, this.height);
            }

            let txtW = mesaureStrokedText(ctx, this.#cost, 30);
            let wStart = (this.width - txtW) / 2;

            drawStrokedText(ctx, this.#cost,
                (-this.width / 2) + wStart,
                (-this.height / 2) + this.height * 0.7, 30);
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        ctx.restore();
    }

    notify(inputEvent) {
        if (!this.#locked &&
            GameContext.getCurrentPlayer().score > this.#cost &&
            inputEvent.type == MouseEventType.MOUSE_DOWN &&
            Collider.checkCollisionPointWithSquare(
                new Vector2d(inputEvent.x, inputEvent.y),
                this.toSquare())
        ) {
            let args = this.#args.map(x => x);

            args.unshift(function () {
                this.#lastUse = new Date();
            }.bind(this));

            let action = Reflect.construct(this.#action, args);

            GameContext.hud.currentAction = action;
            GameContext.engine.addObject(action);
        }
    }

    update(ctx, objects) {
        //nothing to do
    }
}