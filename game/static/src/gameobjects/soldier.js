class Soldier extends RoundObject {
    #image;
    #velocity;
    #attackDistance;
    #angle;
    #attackMode;
    #idle;
    #shotFrequency;
    #shotTimestamp;
    #imgWidth;
    #imgHeight;
    #currFrame;
    #kills;
    #bulletImage;

    constructor(x, y, dronImage, bulletImage) {
        let tmpImg = ResourceManager.instance.getImageResource(dronImage);
        super(tmpImg.width / 2, x, y);

        this.#image = tmpImg;
        this.#angle = 0;
        //this.#velocity = 0.7;

        this.#velocity = 3.0;
        this.#attackDistance = 110;
        this.#attackMode = false;
        this.#idle = false;
        this.#shotTimestamp = new Date();
        this.#shotFrequency = 1000;
        this.#imgWidth = tmpImg.width;
        this.#imgHeight = tmpImg.height;
        this.#currFrame = 0;
        this.#kills = 0;
        this.#bulletImage = bulletImage;

        this.name = "Drone";
        this.zIndex = 20;
        this.selectable = true;
        this.hp = 60;
        this.maxHp = 60;


    }

    get angle() { return this.#angle; }
    set angle(value) { this.#angle = value; }
    get idle() { return this.#idle; }
    set idle(value) { this.#idle = this.#idle; }
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

        if (!this.#attackMode && !this.#idle)
            this.checkCollisions(objects, enemy);

        let now = new Date();
        if (this.#attackMode &&
            (now.getTime() - this.#shotTimestamp.getTime()
                > this.#shotFrequency)
        ) {

            this.doShot(objects);

            this.#shotTimestamp = new Date();
        }

        this.move();
    }

    doShot(objects) {
        let bullet = new Bullet(
            this.x + (this.radius * Math.cos(this.#angle)),
            this.y + (this.radius * Math.sin(this.#angle)),
            new Vector2d(
                Bullet.BULLET_VELOCITY * Math.cos(this.#angle),
                Bullet.BULLET_VELOCITY * Math.sin(this.#angle)
            ),
            this,
            this.#bulletImage
        );

        GameContext.engine.addObject(bullet);
    }

    checkCollisions(objects, clostestEnemy) {

        if (!this.#idle && !this.#attackMode) {
            let nextX = this.x + (this.#velocity * Math.cos(this.#angle)) * 3;
            let nextY = this.y + (this.#velocity * Math.sin(this.#angle)) * 3;

            objects.foreach((obj) => {
                let player = obj.getProperty(Player.PLAYER_PROPERTY);
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

        ctx.drawImage(
            this.#image.frames ? this.#image.frames[this.#currFrame++].image : this.#image,
            -this.#imgWidth / 2,
            -this.#imgHeight / 2,
            this.#imgWidth,
            this.#imgHeight
        ); // draw image offset so its center is at x,y

        if (this.#image.frames && this.#currFrame >= this.#image.frames.length)
            this.#currFrame = 0;

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

        objects.foreach((obj) => {

            if (obj.getProperty(Player.PLAYER_PROPERTY) &&
                obj.getProperty(Player.PLAYER_PROPERTY)
                != this.getProperty(Player.PLAYER_PROPERTY)) {


                let enemyPos = new Vector2d(obj.x, obj.y);
                let myPos = new Vector2d(this.x, this.y);

                let calculatedD = enemyPos.getDistance(myPos);

                if (calculatedD < distance) {
                    distance = calculatedD;
                    closestObj = obj;
                }
            }
        });

        if (closestObj != null) {

            this.#angle = Math.atan2(
                closestObj.y - this.y, closestObj.x - this.x
            );

            if (this.#attackDistance > distance) {
                this.#attackMode = true;
            } else {
                this.#attackMode = false;
            }

        } else {
            this.#idle = true;
        }

        return closestObj;
    }

    notify(inputEvent) {
        if (inputEvent.type == MouseEventType.MOUSE_DOWN &&
            Collider.checkCollisionPointWithSquare(
                new Vector2d(inputEvent.x, inputEvent.y),
                new Square(this.x, this.y, this.radius * 2, this.radius * 2))
        ) {
            console.log("uuid: " + this.id + " clicked");

            Selection.instance.currentSelection = this;
        }
    }

    lumbago(value) {
        this.hp -= value;

        if (this.hp <= 0) {
            this.#image = ResourceManager.instance.getImageResource("bang");
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