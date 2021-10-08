class Button extends SquareObject {
    #action;
    #icon;
    #onlyIcon;
    #player;

    constructor(name, action, x, y, width, height,
        icon = null, onlyIcon = false,
        player = Player.player1) {

        super(width, height, x, y);

        let tmpImg = ResourceManager.instance.getImageResource(icon);

        this.#icon = tmpImg;
        this.name = name;
        this.#action = action;
        this.#onlyIcon = onlyIcon;
        this.#player = player;
    }

    draw(ctx) {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y);

        ctx.drawImage(
            this.#icon,
            0,
            0,
            this.width,
            this.height
        );


        if (!Collider.checkCollisionPointWithSquare(
            new Vector2d(GameContext.inputManager.mousePosX,
                GameContext.inputManager.mousePosY),
            this.toSquare())
        ) {
            ctx.fillStyle = 'rgb(0,0,0,0.25)';
            ctx.fillRect(0, 0, this.width, this.height);
        }


        ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        ctx.restore();
    }

    update(ctx, objects) {

    }
}