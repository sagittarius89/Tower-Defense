class Soldier extends RoundObject {
    #image;
    #velocity;
    #attackDistance;
    #angle;
    #hp;
    #maxHp;
    #attackMode;
    #idle;


    constructor(x, y) {
        let tmpImg = ResourceManager.instance.getImageResource("solider_01_2");
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
    }

    update(ctx, objects) {

        this.draw(ctx);
        this.findClostestEnemy(objects);
        this.checkCollisions(objects);
        this.move();
    }

    checkCollisions(objects) {
        objects.foreach((obj) => {
            if (obj != this && obj instanceof RoundObject) {
                let objPos = new Vector2d(obj.x, obj.y);
                let myPos = new Vector2d(this.x, this.y);

                var distance = myPos.getDistance(objPos);

                if (distance <= this.radius + obj.radius) {
                    this.#angle += (Math.random() > 0.5 ? -1 : 1) * Math.PI / 2;
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

        ctx.rotate(this.#angle - (Math.PI / 2)); // rotate
        ctx.drawImage(this.#image, -this.#image.width / 2, -this.#image.height / 2); // draw image offset so its center is at x,y
        ctx.setTransform(1, 0, 0, 1, 0, 0); // restore default transform
        ctx.restore();
    }

    findClostestEnemy(objects) {
        let distance = Number.MAX_VALUE;
        let closestObj = null;

        objects.foreach((obj) => {

            if (obj.getProperty(Player.PLAYER_PROPERTY)
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
}