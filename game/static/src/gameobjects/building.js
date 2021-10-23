class Building extends SquareObject {
    #image;
    #imageSelected;
    #currFrame;

    static ACTIONS_PROPERY = "ACTIONS_PROPERY";

    constructor(name, nameSelected, x, y, rotating = false) {
        let tmpImg = ResourceManager.instance.getImageResource(name);
        let tmpImgSel = ResourceManager.instance.getImageResource(nameSelected);

        super(tmpImg.width, tmpImg.height, x, y);

        this.#image = name;
        this.#imageSelected = nameSelected;
        this.#currFrame = 0;

        this.zIndex = 10;
        this.selectable = true;
        this.syncable = true;


        if (rotating) {
            this.rotation = 1;
        }
    }

    update(ctx, objects) {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y); // set position of image center

        let centerX = this.width / 2;
        let centerY = this.height / 2;
        let width = this.width;
        let height = this.height;
        let image = ResourceManager.instance.getImageResource(this.#image);

        if (this == Selection.instance.currentSelection) {
            image = ResourceManager.instance.getImageResource(this.#imageSelected);
        }

        if (this.rotation) {
            this.rotation += Math.PI / 64;
            if (this.rotation > Math.PI * 2) {
                this.rotation = 1;
            }

            ctx.rotate(this.rotation); // rotate
        }

        if (image.frames) {
            if (image.frames && this.#currFrame >= image.frames.length)
                this.#currFrame = 0;

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


        ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        ctx.restore();

        drawHpStripe(ctx, this.maxHp, this.hp,
            this.pos.x - this.width * 0.4, this.pos.y - this.height * 0.4,
            this.width, 5);
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

            this.#image = "bang";
            this.#imageSelected = this.#image;

            this.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
                null);
            this.addProperty(Player.PLAYER_PROPERTY,
                null);

            if (Selection.instance.currentSelection == this) {
                Selection.instance.currentSelection = null;
            }

            return true;
        }

        return false;
    }

    toDTO() {
        let dto = super.toDTO();

        dto.image = this.#image;
        dto.imageSelected = this.#imageSelected;

        dto.type = this.constructor.name;
        return dto;
    }

    static fromDTO(dto, obj = new Building(
        dto.image,
        dto.imageSelected,
        dto.x,
        dto.y)) {

        super.fromDTO(dto, obj);

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        this.#image = dto.image;
        this.#imageSelected = dto.imageSelected;
    }
}