class Bullet extends RoundObject {
    #vector;
    #parent;
    #image;
    #currFrame;
    #imgWidth;
    #imgHeight;

    constructor(x, y, vector, parent, image) {
        let tmpImg = ResourceManager.instance.getImageResource(image);

        if (CONSTS.BLOCKOUT) {
            super(CONSTS.BULLET.RADIUS, x, y);
        } else {
            super(tmpImg.width, x, y);
        }


        this.#image = image;
        this.#imgWidth = tmpImg.width;
        this.#imgHeight = tmpImg.height;
        this.#vector = vector;
        this.selectable = false;
        this.syncable = true;
        this.#parent = parent;
        this.zIndex = 50;
        this.#currFrame = 0;
    }

    update(ctx, objects) {
        if (CONSTS.BLOCKOUT) {
            this.blockout(ctx);
        } else {
            this.realGraphic(ctx);
        }
    }

    blockout(ctx) {
        CTX.setTransform(1, 0, 0, 1, this.x, this.y);

        ctx.fillStyle = 'blue';

        ctx.beginPath();
        CTX.ellipse(
            this.radius / 2,
            this.radius / 2,
            this.radius,
            this.radius,
            0,
            0,
            2 * Math.PI);
        ctx.fill();
        ctx.fill();
        ctx.stroke();

        CTX.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
    }

    realGraphic(ctx) {
        let image = ResourceManager.instance.getImageResource(this.#image);

        ctx.setTransform(1, 0, 0, 1, this.x, this.y);

        let angle = Math.atan2(
            this.#vector.y, this.#vector.x
        );

        ctx.rotate(angle - (0.0 * Math.PI));

        ctx.drawImage(
            image.frames ? image.frames[this.#currFrame++].image : image,
            -this.#imgWidth / 2,
            -this.#imgHeight / 2,
            this.#imgWidth,
            this.#imgHeight
        );

        if (image.frames && this.#currFrame >= image.frames.length)
            this.#currFrame = 0;

        ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
    }


    logic(objects) {
        this.x += this.#vector.x;
        this.y += this.#vector.y;

        this.checkCollisions(objects);
    }

    checkCollisions(objects) {
        objects.foreach(obj => {
            if (obj.id != this.#parent && obj.constructor.name != 'Wall' &&
                (obj instanceof Soldier || obj instanceof Building)) {

                let player = obj.owner;

                if (player) {

                    if (obj instanceof RoundObject) {
                        let objPos = new Vector2d(obj.x, obj.y);
                        let myPos = new Vector2d(this.x, this.y);

                        var distance = myPos.getDistance(objPos);

                        if (distance <= this.radius + obj.radius) {
                            obj.lumbago();
                        }
                    } else if (obj instanceof SquareObject) {
                        let myPos = new Vector2d(this.x, this.y);

                        if (Collider.checkCollisionPointWithSquare(myPos, obj.toSquare())) {
                            obj.lumbago()
                        }
                    }
                }
            }
        });
    }

    toDTO() {
        let dto = super.toDTO();

        dto.vector = this.#vector.toDTO();
        dto.parent = this.#parent;
        dto.image = this.#image;
        dto.imgWidth = this.#imgWidth;
        dto.imgHeight = this.#imgHeight;

        dto.type = this.constructor.name;
        return dto;
    }

    static fromDTO(dto, obj = new Bullet(dto.x, dto.y,
        Vector2d.fromDTO(dto.vector), dto.parent, dto.image)) {

        super.fromDTO(dto, obj);

        obj.#vector = Vector2d.fromDTO(dto.vector);
        obj.#parent = GameContext.engine.objects.byId(parent);
        obj.#image = dto.image;
        obj.#imgWidth = dto.imgWidth;
        obj.#imgHeight = dto.imgHeight;
        obj.#currFrame = 0;

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        this.#vector = Vector2d.fromDTO(dto.vector);
        this.#image = dto.image;
    }
}
