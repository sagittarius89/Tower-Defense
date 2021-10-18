class Soldier extends RoundObject {
    #image;
    #velocity;
    #attackDistance;
    #angle;
    #attackMode;
    #idle;
    #imgWidth;
    #imgHeight;
    #currFrame;
    #kills;
    #bulletImage;

    constructor(x, y, dronImage, bulletImage, owner) {
        let tmpImg = ResourceManager.instance.getImageResource(dronImage);
        super(tmpImg.width / 2, x, y);

        this.#image = dronImage;
        this.#angle = 0;

        this.#velocity = 3.0;
        this.#attackDistance = 110;
        this.#attackMode = false;
        this.#idle = false;
        this.#imgWidth = tmpImg.width;
        this.#imgHeight = tmpImg.height;
        this.#currFrame = 0;
        this.#kills = 0;
        this.#bulletImage = bulletImage;

        this.owner = owner;
        this.name = "Drone";
        this.zIndex = 20;
        this.selectable = true;
        this.hp = 60;
        this.maxHp = 60;
        this.syncable = true;


    }

    get angle() { return this.#angle; }
    set angle(value) { this.#angle = value; }
    get idle() { return this.#idle; }
    set idle(value) { this.#idle = value; }
    get pos() { return new Vector2d(this.x, this.y); }
    set pos(value) {
        this.x = value.x;
        this.y = value.y;
    }

    get kills() { return this.#kills; }
    set kills(value) { this.#kills = Number.parseInt(value); }

    update(ctx, objects) {
        let enemy = this.findClostestEnemy(objects);

        this.draw(ctx, enemy);
    }

    logic(objects) {

        let enemy = this.findClostestEnemy(objects);

        if (!this.#attackMode && !this.#idle)
            this.checkCollisions(objects, enemy);

        if (this.hp <= 0) {
            this.#image = "bang";
            this.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
                null);

            if (Selection.instance.currentSelection == this) {
                Selection.instance.currentSelection = null;
            }

            return true;
        }


        this.move();
    }

    checkCollisions(objects, clostestEnemy) {

        if (!this.#idle && !this.#attackMode) {
            let nextX = this.x + (this.#velocity * Math.cos(this.#angle)) * 3;
            let nextY = this.y + (this.#velocity * Math.sin(this.#angle)) * 3;

            objects.foreach((obj) => {
                let player = obj.owner;
                if (obj != this && player && obj instanceof RoundObject) {

                    let objPos = new Vector2d(obj.x, obj.y);
                    let myPos = new Vector2d(nextX, nextY);

                    var distance = myPos.getDistance(objPos);

                    if (distance <= this.radius + obj.radius) {

                        Collider.resolveIntersectionBallBall(this, obj);

                        let angle1 = this.#angle + Math.PI / 2;
                        let angle2 = this.#angle - Math.PI / 2;

                        let v1 = new Vector2d(
                            nextX + (this.#velocity * Math.cos(angle1)),
                            nextY + (this.#velocity * Math.sin(angle1))
                        );

                        let v2 = new Vector2d(
                            nextX + (this.#velocity * Math.cos(angle2)),
                            nextY + (this.#velocity * Math.sin(angle2))
                        );

                        let d1, d2 = 0;

                        if (clostestEnemy && clostestEnemy.pos) {
                            d1 = v1.getDistance(clostestEnemy.pos);
                            d2 = v2.getDistance(clostestEnemy.pos);
                        }
                        if (d1 < d2)
                            this.#angle = angle1;
                        else
                            this.#angle = angle2;
                    }
                }
            });
        }
    }

    resolveCollision() {

    }

    move() {
        if (!this.#idle && !this.#attackMode) {
            this.x += this.#velocity * Math.cos(this.#angle);
            this.y += this.#velocity * Math.sin(this.#angle);
        }
    }

    draw(ctx, clostestEnemy) {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y); // set position of image center

        let image = ResourceManager.instance.getImageResource(this.#image);

        if (this == Selection.instance.currentSelection) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.beginPath();
            ctx.ellipse(
                this.radius / 2,
                this.radius / 2,
                this.radius * 1.5,
                this.radius,
                0,
                0,
                2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }

        ctx.rotate(this.#angle - Math.PI); // rotate

        if (image.frames) {

            if (this.#currFrame >= image.frames.length)
                this.#currFrame = 0;
            image = image.frames[this.#currFrame++].image;
        }

        ctx.drawImage(
            image,
            -this.#imgWidth / 2,
            -this.#imgHeight / 2,
            this.#imgWidth,
            this.#imgHeight
        );


        ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        ctx.restore();

        if (clostestEnemy && GameContext.debug) {
            let randomColor = Math.floor(Math.random() * 16777215).toString(16);

            ctx.strokeStyle = '#' + randomColor;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(clostestEnemy.x, clostestEnemy.y);
            ctx.stroke();
        }

        drawHpStripe(ctx, this.maxHp, this.hp,
            this.x - this.radius,
            this.y - (this.radius * 1, 25),
            this.radius * 2, 5);
    }

    findClostestEnemy(objects) {
        let distance = Number.MAX_VALUE;
        let closestObj = null;

        objects.foreach(((obj) => {

            if (obj.owner && obj.owner.name != this.owner.name) {
                let calculatedD = obj.pos.getDistance(this.pos);

                if (calculatedD < distance) {
                    distance = calculatedD;
                    closestObj = obj;
                }
            }
        }).bind(this));

        if (closestObj != null) {

            this.#angle = Math.atan2(
                closestObj.y - this.y, closestObj.x - this.x
            );

            this.#attackMode = this.#attackDistance > distance;
        } else {
            this.#idle = true;
        }

        return closestObj;
    }

    notify(inputEvent) {
        if (inputEvent.type == MouseEventType.MOUSE_DOWN &&
            Collider.checkCollisionPointWithSquare(
                new Vector2d(inputEvent.x, inputEvent.y),
                new Square(this.x - this.radius,
                    this.y - this.radius,
                    this.radius * 2, this.radius * 2))
        ) {
            console.log("uuid: " + this.id + " clicked");

            Selection.instance.currentSelection = this;
        }
    }

    toDTO() {
        let dto = super.toDTO();

        dto.image = this.#image;
        dto.bulletImage = this.#bulletImage;
        dto.velocity = this.#velocity;
        dto.attackDistance = this.#attackDistance;
        dto.angle = this.#angle;
        dto.attackMode = this.#attackMode;
        dto.idle = this.#idle;
        dto.imgWidth = this.#imgWidth;
        dto.imgHeight = this.#imgHeight;
        dto.currFrame = 0;
        dto.kills = this.#kills;

        dto.type = this.constructor.name;
        return dto;
    }

    static fromDTO(dto, obj = new Soldier(
        dto.x,
        dto.y,
        dto.image,
        dto.bulletImage,
        Player.fromDTO(dto.owner))) {

        super.fromDTO(dto, obj);

        obj.#velocity = dto.velocity;
        obj.#attackDistance = dto.attackDistance;
        obj.#angle = dto.angle;
        obj.#attackMode = dto.attackMode;
        obj.#idle = dto.idle;
        obj.#kills = dto.kills;
        obj.#image = dto.image;
        obj.#bulletImage = dto.bulletImage;

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        this.#velocity = dto.velocity;
        this.#attackDistance = dto.attackDistance;
        this.#angle = dto.angle;
        this.#attackMode = dto.attackMode;
        this.#idle = dto.idle;
        this.#kills = dto.kills;
        this.#image = dto.image;
        this.#bulletImage = dto.bulletImage;

    }
}