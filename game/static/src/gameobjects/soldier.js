class Soldier extends RoundObject {
    #image;
    #velocity;
    #attackDistance;
    #angle;
    #hp;
    #maxHp;
    #attackMode;
    #idle;
    #shotFrequency;
    #shotTimestamp;


    constructor(x, y) {
        let tmpImg = ResourceManager.instance.getImageResource("solider_01_3");
        super(tmpImg.width / 2, x, y);

        this.#image = tmpImg;
        this.zIndex = 20;
        this.selectable = true;
        this.#angle = 0;
        this.#hp = 60;
        this.#maxHp = 60;
        this.#velocity = 0.7;
        this.#attackDistance = 110;
        this.#attackMode = false;
        this.#idle = false;
        this.#shotTimestamp = new Date();
        this.#shotFrequency = 1000;
    }

    update(ctx, objects) {

        this.draw(ctx);
        this.findClostestEnemy(objects);

        if (!this.#attackMode && !this.#idle)
            this.checkCollisions(objects);

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
            this
        );

        GameContext.engine.addObject(bullet);
    }

    checkCollisions(objects) {
        objects.foreach((obj) => {
            let player = obj.getProperty(Player.PLAYER_PROPERTY);
            if (obj != this && player && obj instanceof RoundObject) {
                let objPos = new Vector2d(obj.x, obj.y);
                let myPos = new Vector2d(this.x, this.y);

                var distance = myPos.getDistance(objPos);

                if (distance <= this.radius + obj.radius) {
                    this.#angle += Math.PI / 2;
                }
            }
        });
    }

    resolveCollision() {

    }

    move() {
        if (!this.#idle && !this.#attackMode) {
            this.x += this.#velocity * Math.cos(this.#angle);
            this.y += this.#velocity * Math.sin(this.#angle);
        }
    }

    draw(ctx) {
        ctx.setTransform(1, 0, 0, 1, this.x, this.y); // set position of image center

        /*let gradient = ctx.createRadialGradient(
            this.radius / 2, this.radius / 2,
            0, this.radius / 2,
            this.radius / 2, this.radius * 2);

        gradient.addColorStop(0, 'black');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;

        ctx.ellipse(
            this.radius / 2,
            this.radius / 2,
            this.radius * 2,
            this.radius,
            0,
            0,
            2 * Math.PI);

        ctx.fill();*/

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
        ctx.drawImage(this.#image, -this.#image.width / 2, -this.#image.height / 2); // draw image offset so its center is at x,y
        ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        ctx.restore();
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
            }

        } else {
            this.#idle = true;
        }
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
        this.#hp -= value;

        if (this.#hp < 0) {
            GameContext.engine.objects.delete(this);
        }
    }
}