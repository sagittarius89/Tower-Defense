class Bullet extends RoundObject {
    #vector;
    #parent;
    #image;
    #currFrame;
    #imgWidth;
    #imgHeight;

    static BULLET_VELOCITY = 3;

    constructor(x, y, vector, parent, image) {
        super(5, x, y);

        if (image) {
            let tmpImg = ResourceManager.instance.getImageResource(image);

            this.#image = tmpImg;
            this.#imgWidth = tmpImg.width;
            this.#imgHeight = tmpImg.height;
        }

        this.#vector = vector;
        this.selectable = false;
        this.#parent = parent;
        this.zIndex = 50;
        this.#currFrame = 0;
    }

    update(ctx, objects) {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y);

        let angle = Math.atan2(
            this.#vector.y, this.#vector.x
        );

        ctx.rotate(angle - (0.0 * Math.PI));

        ctx.drawImage(
            this.#image.frames ? this.#image.frames[this.#currFrame++].image : this.#image,
            -this.#imgWidth / 2,
            -this.#imgHeight / 2,
            this.#imgWidth,
            this.#imgHeight
        );

        if (this.#image.frames && this.#currFrame >= this.#image.frames.length)
            this.#currFrame = 0;

        ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        ctx.restore();
    }


    logic(objetcs) {
        this.x += this.#vector.x;
        this.y += this.#vector.y;

        this.checkCollisions(objects);
    }

    checkCollisions(objects) {
        objects.foreach(obj => {
            if (obj != this.#parent &&
                (obj instanceof Soldier || obj instanceof Building)) {

                let player = obj.getProperty(Player.PLAYER_PROPERTY);

                if (player) {

                    if (obj instanceof RoundObject) {
                        let objPos = new Vector2d(obj.x, obj.y);
                        let myPos = new Vector2d(this.x, this.y);

                        var distance = myPos.getDistance(objPos);

                        if (distance <= this.radius + obj.radius) {
                            if (obj.lumbago(10)) {
                                this.#parent.kills++;
                            }

                            GameContext.engine.objects.delete(this);
                        }
                    } else if (obj instanceof SquareObject) {
                        let myPos = new Vector2d(this.x, this.y);

                        if (Collider.checkCollisionPointWithSquare(myPos, obj.toSquare())) {
                            if (obj.lumbago(10)) {
                                this.#parent.kills++;
                            }

                            GameContext.engine.objects.delete(this);
                        }
                    }
                }
            }
        });
    }

    toDTO() {
        let dto = super.toDTO();

        dto.#vector = this.#vector.toDTO();
        dto.#parent = this.#parent.id;
        dto.#image = geImagetName(this.#image);
        dto.#currFrame = this.#currFrame;
        dto.#imgWidth = this.#imgWidth;
        dto.#imgHeight = this.#imgHeight;

        return dto;
    }

    static fromDTO(dto, objects,
        loadResources = true,
        obj = new Bullet()) {

        super.fromDTO(dto, obj);

        obj.#vector = Vector2d.fromDTO(dto.vector);
        obj.#parent = objects.byId(parent);

        if (loadResources) {
            obj.#image = ResourceManager.instance.getImageResource(dto.image);
        }
        else {
            obj.#image = dto.image;
        }

        obj.#imgWidth = dto.imgWidth;
        obj.#imgHeight = dto.imgHeight;

        obj.#currFrame = 0;

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        obj.#vector = Vector2d.fromDTO(dto.vector);
    }
}