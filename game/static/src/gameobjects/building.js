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
        let width = this.width;
        let height = this.height;
        let image = this.#image;

        if (this == Selection.instance.currentSelection) {
            image = this.#imageSelected;
        }

        if (image.frames) {
            image = image.frames[this.#currFrame++].image;

            let scale = this.height / image.height;

            width = image.width;
            height = image.height;

            ctx.drawImage(
                image,
                -(width * scale) / 2,
                -(height * scale) / 2,
                width * scale,
                height * scale);

        } else {

            ctx.drawImage(
                image,
                -width / 2,
                -height / 2);
        }

        if (this.#image.frames && this.#currFrame >= this.#image.frames.length)
            this.#currFrame = 0;



        drawHpStripe(ctx, this.maxHp, this.hp,
            -this.width * 0.4, -this.height * 0.4,
            this.width, 5);


        ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        ctx.restore();
    }

    notify(inputEvent) {
        if (inputEvent.type == MouseEventType.MOUSE_DOWN &&
            Collider.checkCollisionPointWithSquare(
                new Vector2d(inputEvent.x, inputEvent.y),
                new Square(
                    this.x,
                    this.y,
                    this.width,
                    this.height))
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