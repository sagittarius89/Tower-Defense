class Building extends SquareObject {
    #image;
    #imageSelected;
    #currFrame;
    #color;

    static ACTIONS_PROPERY = "ACTIONS_PROPERY";

    constructor(width, height, x, y, color, rotating = false) {
        //let tmpImg = ResourceManager.instance.getImageResource(name);
        //let tmpImgSel = ResourceManager.instance.getImageResource(nameSelected);

        super(width, height, x, y);

        //this.#image = name;
        //this.#imageSelected = nameSelected;
        this.#color = color;
        this.#currFrame = 0;

        this.zIndex = 10;
        this.selectable = true;
        this.syncable = true;


        if (rotating) {
            this.rotation = 1;
        }
    }

    update(ctx, objects) {
        if (CONSTS.BLOCKOUT) {
            this.blockout(ctx);
        } else {
            this.drawRealGraphic(ctx);
        }
    }

    blockout(ctx) {
        CTX.setTransform(1, 0, 0, 1, this.x, this.y); // set position of image center

        let centerX = this.width / 2;
        let centerY = this.height / 2;
        let width = this.width;
        let height = this.height;


        ctx.fillStyle = 'blue'; // Set the fill color
        CTX.drawRect(-centerX, -centerY, width, height); // Draw the rectangle

        drawHpStripe(ctx, this.maxHp, this.hp,
            - 0.5 * this.width, - 0.6 * this.height,
            this.width, 5);

        CTX.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        CTX.restore();
    }

    drawRealGraphic(ctx) {
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

        if (this.hit && this.hit > 0) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(0, 0, this.width * 0.25, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1.0;
            this.hit -= 1;
        }
    }


    notify(inputEvent) {
        if (inputEvent.type == MouseEventType.MOUSE_DOWN &&
            Collider.checkCollisionPointWithSquare(
                new Vector2d(inputEvent.x, inputEvent.y),
                new Square(
                    this.x,
                    this.y,
                    this.width * 0.8,
                    this.height * 0.8))
        ) {
            console.log("uuid: " + this.id + " clicked");

            //Selection.instance.currentSelection = this;
        }
    }

    lumbago() {
        this.hit = 10;
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