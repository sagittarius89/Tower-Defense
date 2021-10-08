class Building extends SquareObject {
    #image;
    #imageSelected;
    #currFrame;

    static ACTIONS_PROPERY = "ACTIONS_PROPERY";

    constructor(name, nameSelected, x, y) {
        let tmpImg = ResourceManager.instance.getImageResource(name);
        let tmpImgSel = ResourceManager.instance.getImageResource(nameSelected);

        super(tmpImg.width, tmpImg.height, x, y);

        this.#image = tmpImg;
        this.#imageSelected = tmpImgSel;
        this.#currFrame = 0;

        this.zIndex = 10;
        this.selectable = true;
    }

    update(ctx, objects) {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y); // set position of image center

        let centerX = this.width / 2;
        let centerY = this.height / 2;

        if (this == Selection.instance.currentSelection) {
            ctx.drawImage(
                this.#imageSelected.frames ? this.#imageSelected.frames[this.#currFrame++].image : this.#imageSelected,
                -this.width / 2,
                -this.height / 2);
        } else {
            ctx.drawImage(
                this.#image.frames ? this.#image.frames[this.#currFrame++].image : this.#image,
                -this.width / 2,
                -this.height / 2);
        }

        if (this.#image.frames && this.#currFrame >= this.#image.frames.length)
            this.#currFrame = 0;


        ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        ctx.restore();
    }

    notify(inputEvent) {
        if (inputEvent.type == MouseEventType.MOUSE_DOWN &&
            Collider.checkCollisionPointWithSquare(
                new Vector2d(inputEvent.x, inputEvent.y),
                new Square(this.x, this.y, this.width, this.height))
        ) {
            console.log("uuid: " + this.id + " clicked");

            Selection.instance.currentSelection = this;
        }
    }

    lumbago(value) {
        this.hp -= value;

        if (this.hp <= 0) {
            this.#image = ResourceManager.instance.getImageResource("bang");
            this.imageSelected = this.#image;
            this.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
                null);
            this.addProperty(Player.PLAYER_PROPERTY,
                null);

            if (Selection.instance.currentSelection == this) {
                Selection.instance.currentSelection = null;
            }

            setTimeout(function () {
                GameContext.engine.objects.delete(this);


            }.bind(this), 1000);

            return true;
        }

        return false;
    }
}