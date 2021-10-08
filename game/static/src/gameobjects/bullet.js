class Bullet extends RoundObject {
    #vector;
    #parent;
    #image;
    #currFrame;
    #imgWidth;
    #imgHeight;

    static BULLET_VELOCITY = 1.5;

    constructor(x, y, vector, parent, image) {
        super(5, x, y);
        let tmpImg = ResourceManager.instance.getImageResource(image);

        this.#vector = vector;
        this.selectable = false;
        this.#parent = parent;
        this.zIndex = 50;
        this.#image = tmpImg;
        this.#currFrame = 0;
        this.#imgWidth = tmpImg.width;
        this.#imgHeight = tmpImg.height;
    }



    update(ctx, objects) {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y);

        //ctx.beginPath();
        //ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        //ctx.fill();


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
}