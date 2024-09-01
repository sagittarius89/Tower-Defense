class MoveSoldier extends GameAction {
    #soldier;
    #lock;

    constructor(callback, player, soldier) {
        super(callback, player, soldier);
        this.#soldier = soldier;
        this.player = player;
        this.#lock = true;
    }

    update(ctx, objects) {
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        ctx.beginPath();
        CTX.moveTo(this.#soldier.x, this.#soldier.y);
        ctx.lineTo(GameContext.inputManager.mousePosX, GameContext.inputManager.mousePosY);
        ctx.stroke();
        ctx.closePath();
    }

    mouseUp() {
        super.stop();

        let pos = new Vector2d(
            GameContext.inputManager.mousePosX - CTX.trX(this.#soldier.x),
            GameContext.inputManager.mousePosY - CTX.trY(this.#soldier.y)
        );


        Network.instance.moveSoldier(this.#soldier.id, pos);

        if (CONSTS.DEBUG)
            console.log("Move soldier to: " + this.#soldier.movement.x + " " + this.#soldier.movement.y);
    }
}


class Soldier extends RoundObject {
    #image;
    #velocity;
    #attackDistance;
    #angle;
    #attackMode;
    #idle;
    #hold;
    #imgWidth;
    #imgHeight;
    #currFrame;
    #kills;
    #bulletImage;
    #movement;
    #pathAngle;
    #enemyAngle;
    #forcedMovementAngle;
    #path;

    constructor(x, y, dronImage, bulletImage, owner) {
        let tmpImg = ResourceManager.instance.getImageResource(dronImage);
        super(CONSTS.SOLDIER.RADIUS, x, y);

        this.#image = dronImage;
        this.#angle = 0;
        this.#pathAngle = 0;
        this.#enemyAngle = 0;
        this.#forcedMovementAngle = 0;
        this.#path = [];

        this.#velocity = CONSTS.SOLDIER_VELOCITY;
        this.#attackDistance = CONSTS.SOLDIER.ATTACK_DISTANCE;
        this.hp = CONSTS.SOLDIER.HP;
        this.maxHp = CONSTS.SOLDIER.HP;
        this.#movement = new Vector2d(0, 0);
        this.#attackMode = false;
        this.#idle = false;
        this.#imgWidth = tmpImg.width;
        this.#imgHeight = tmpImg.height;
        this.#currFrame = 0;
        this.#kills = 0;
        this.#bulletImage = bulletImage;
        this.#hold = false;

        this.owner = owner;
        this.name = "Drone";
        this.zIndex = 20;
        this.selectable = true;
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
    set movement(value) { this.#movement = value; }
    get movement() { return this.#movement; }

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

            //if (Selection.instance.currentSelection == this) {
            //    Selection.instance.currentSelection = null;
            //}

            return true;
        }

        if (!this.#hold)
            this.move(objects);
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

    move(objectList) {
        if (this.#movement.x != 0 || this.#movement.y != 0) {

            for (let i = 0; i < 8; i++) {
                let deltaX = Math.round(this.#velocity * Math.cos(this.#forcedMovementAngle), 4);
                let deltaY = Math.round(this.#velocity * Math.sin(this.#forcedMovementAngle), 4);

                this.x += deltaX;
                this.y += deltaY;

                if (GameContext.engine.aStrPthFnd.checkObjsObjCollision(objectList, this)) {
                    this.x -= deltaX;
                    this.y -= deltaY;

                    this.#forcedMovementAngle += Math.PI / 8;
                } else {
                    break;
                }
            }

        } else if (!this.#idle && !this.#attackMode) {

            for (let i = 0; i < 8; i++) {
                let deltaX = Math.round(this.#velocity * Math.cos(this.#pathAngle), 4);
                let deltaY = Math.round(this.#velocity * Math.sin(this.#pathAngle), 4);

                this.x += deltaX;
                this.y += deltaY;

                if (GameContext.engine.aStrPthFnd.checkObjsObjCollision(objectList, this)) {
                    this.x -= deltaX;
                    this.y -= deltaY;


                    this.#forcedMovementAngle += Math.PI / 8;
                } else {
                    break;
                }
            }
        }
    }

    draw(ctx, clostestEnemy) {
        if (CONSTS.BLOCKOUT) {
            this.blockout(ctx);
        }
        else {
            this.drawRealGraphic(ctx);
        }

        if (CONSTS.debug && clostestEnemy) {
            let randomColor = Math.floor(Math.random() * 16777215).toString(16);

            ctx.strokeStyle = '#' + randomColor;
            ctx.beginPath();
            CTX.moveTo(this.x, this.y);
            CTX.lineTo(clostestEnemy.x, clostestEnemy.y);
            ctx.stroke();
        }
    }

    drawRealGraphic(ctx) {
        ctx.resetTransform();
        CTX.translate(this.x, this.y);
        CTX.setTransform(1, 0, 0, 1, this.x, this.y);
        let image = ResourceManager.instance.getImageResource(this.#image);

        if (this == Selection.instance.currentSelection) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.beginPath();
            CTX.ellipse(
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

        CTX.translate(this.x, this.y);


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

        ctx.beginPath();
        CTX.ellipse(
            this.radius / 2,
            this.radius / 2,
            this.radius * 1.5,
            this.radius,
            0,
            0,
            2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        CTX.ellipse(
            this.radius / 2,
            this.radius / 2,
            this.radius * 1.5,
            this.radius,
            0,
            0,
            2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        if (this.hit && this.hp > 0 && this.hit > 0) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.globalAlpha = 1.0;
            this.hit -= 1;
        }
    }

    blockout(ctx) {
        if (this.owner.name == GameContext.getCurrentPlayer().name) {
            ctx.fillStyle = "#A1D6B2AA";
            ctx.beginPath();
            CTX.ellipse(
                this.x,
                this.y,
                this.radius * 1.1,
                this.radius * 1.1,
                0,
                0,
                2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }


        CTX.setTransform(1, 0, 0, 1, this.x, this.y);
        if (CONSTS.DEBUG)
            drawStrokedText(ctx, `${Math.floor(CTX.trX(this.x))} ${Math.floor(CTX.trY(this.y))} ${this.#angle}`,
                -this.radius / 2, -this.radius * 1.5, 10);



        CTX.drawRect(-5, -5, 10, 10);

        if (this.hp == 0)
            ctx.fillStyle = "red";
        else if (this.owner.name == "Player 2")
            ctx.fillStyle = "#fff44f";
        else
            ctx.fillStyle = "#19647e";

        let angle = this.#forcedMovementAngle != 0 ? this.#forcedMovementAngle : this.#pathAngle;

        ctx.beginPath();
        CTX.moveTo(0, 0, angle);
        CTX.lineTo(-this.radius / 2, -this.radius / 2, angle);
        CTX.lineTo(this.radius, 0, angle);
        CTX.lineTo(-this.radius / 2, this.radius / 2, angle);
        CTX.lineTo(0, 0, angle);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();


        ctx.strokeStyle = 'rgba(0, 0, 1)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        CTX.moveTo(0, 0);
        CTX.lineTo(this.radius * 1.2, 0, this.#enemyAngle);
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = 1;

        if (this.hp > 0) {
            drawHpStripe(ctx, this.maxHp, this.hp,
                -this.radius / 2,
                -this.radius,
                this.radius * 1.5, 10);
        }

        CTX.setTransform(1, 0, 0, 1, 0, 0);


        if (CONSTS.DEBUG && this.#path[0] && this.owner.name == "Player 2") {
            ctx.beginPath();
            CTX.moveTo(
                GameContext.engine.aStrPthFnd.trX(this.#path[0].x),
                GameContext.engine.aStrPthFnd.trY(this.#path[0].y)
            )
                ;
            ctx.fillStyle = 'red';
            this.#path.forEach((point) => {
                CTX.lineTo(
                    GameContext.engine.aStrPthFnd.trX(point.x),
                    GameContext.engine.aStrPthFnd.trY(point.y)
                );
                CTX.drawRect(
                    GameContext.engine.aStrPthFnd.trX(point.x),
                    GameContext.engine.aStrPthFnd.trY(point.y),
                    5, 5);
            });
            ctx.strokeStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
            ctx.stroke();
            ctx.closePath();
        }
    }

    findClostestEnemy(objects) {
        let distance = Number.MAX_VALUE;
        let closestObj = null;

        objects.foreach(((obj) => {

            if (obj.owner &&
                obj.owner.name != this.owner.name &&
                !(obj instanceof Wall)) {
                let calculatedD = obj.pos.getDistance(this.pos);

                if (calculatedD < distance) {
                    distance = calculatedD;
                    closestObj = obj;
                }
            }
        }).bind(this));

        if (closestObj != null) {

            let enemyDir = new Vector2d(closestObj.x - this.x, closestObj.y - this.y);
            let absDir = enemyDir.add(this.#movement);

            this.#angle = Math.atan2(
                absDir.y, absDir.x
            );

            let nextStepX1 = closestObj.x;
            let nextStepY1 = closestObj.y;
            let nextStepX2 = this.x;
            let nextStepY2 = this.y;

            if (this.#path.length > 1) {
                nextStepX1 = GameContext.engine.aStrPthFnd.trX(this.#path[0].x);
                nextStepY1 = GameContext.engine.aStrPthFnd.trY(this.#path[0].y);
                nextStepX2 = GameContext.engine.aStrPthFnd.trX(this.#path[1].x);
                nextStepY2 = GameContext.engine.aStrPthFnd.trY(this.#path[1].y);
            }

            this.#pathAngle = Math.atan2(
                (nextStepY2 - nextStepY1),
                (nextStepX2 - nextStepX1)
            );

            this.#enemyAngle = Math.atan2(
                closestObj.y - this.y, closestObj.x - this.x
            );

            this.#forcedMovementAngle = Math.atan2(this.#movement.y, this.#movement.x);

            this.#attackMode = this.#attackDistance > distance;
        } else {
            this.#idle = true;
        }

        return closestObj;
    }

    notify(inputEvent) {
        if (GameContext.getCurrentPlayer().name === this.owner.name &&
            inputEvent.type == MouseEventType.MOUSE_DOWN &&
            Collider.checkCollisionPointWithSquare(
                new Vector2d(inputEvent.x, inputEvent.y),
                new Square(
                    CTX.trX(this.x - this.radius),
                    CTX.trY(this.y - this.radius),
                    CTX.trX(this.radius * 5),
                    CTX.trHeight(this.radius * 5)))
        ) {
            console.log("uuid: " + this.id + " clicked");


            let action = new MoveSoldier(() => {
                console.log("Move soldier");
            }, this.owner, this);


            GameContext.engine.addObject(action);
            GameContext.hud.currentAction = action;

            //Selection.instance.currentSelection = this;
        } else if (
            GameContext.getCurrentPlayer().name === this.owner.name &&
            inputEvent.type == MouseEventType.MOUSE_RIGHT_CLICK &&
            Collider.checkCollisionPointWithSquare(
                new Vector2d(inputEvent.x, inputEvent.y),
                new Square(
                    CTX.trX(this.x - this.radius),
                    CTX.trY(this.y - this.radius),
                    CTX.trX(this.radius * 5),
                    CTX.trHeight(this.radius * 5)))) {

            console.log("uuid: " + this.id + " double clicked");

            Network.instance.holdSoldier(this.id);
        }
    }

    toDTO() {
        let dto = super.toDTO();

        dto.velocity = this.#velocity;
        dto.angle = this.#angle;
        dto.attackMode = this.#attackMode;
        dto.idle = this.#idle;
        dto.imgWidth = this.#imgWidth;
        dto.imgHeight = this.#imgHeight;
        dto.movement = this.#movement.toDTO();

        dto.type = this.constructor.name;
        return dto;
    }

    lumbago() {
        this.hit = 10;
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
        obj.#movement = Vector2d.fromDTO(dto.movement);
        obj.#path = dto.path;
        obj.#hold = dto.hold;

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
        this.#movement = Vector2d.fromDTO(dto.movement);
        this.#path = dto.path;
        this.#hold = dto.hold;

    }
}