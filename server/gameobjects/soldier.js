const RoundObject = require('./roundobject');
const ResourceManager = require('../resourcemanager').ResourceManager;
const Player = require('../../shared/player.js').Player;
const Vector2d = require('../../game/static/src/math/vector').Vector2d;
const Bullet = require('./bullet');
const Collider = require('../../game/static/src/physics/collider').Collider;
const ColliderShape = require('../../game/static/src/physics/collider').ColliderShape;
const CONSTS = require('../../shared/consts').CONSTS;
const Utils = require('../../shared/utils.js');
const Wall = require('./wallbuilding');

module.exports = class Soldier extends RoundObject {
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
    #movement;
    #pathAngle;
    #enemyAngle;
    #forcedMovementAngle;
    #lastActonCooldown;
    #path;

    constructor(x, y, dronImage, bulletImage, owner) {
        let tmpImg = ResourceManager.instance.getImageResource(dronImage);
        super(CONSTS.SOLDIER.RADIUS, x, y);

        this.#image = dronImage;
        this.#angle = 0;
        this.#pathAngle = 0;
        this.#enemyAngle = 0;
        this.#forcedMovementAngle = 0;
        this.#lastActonCooldown = 0;
        this.#path = [];

        this.#velocity = CONSTS.SOLDIER_VELOCITY;
        this.#attackDistance = CONSTS.SOLDIER.ATTACK_DISTANCE;
        this.hp = CONSTS.SOLDIER.HP;
        this.maxHp = CONSTS.SOLDIER.HP;
        this.#shotFrequency = CONSTS.SOLDIER.SHOT_FREQUENCY;
        this.#attackMode = false;
        this.#idle = false;
        this.#shotTimestamp = new Date().getTime();
        this.#movement = new Vector2d(0, 0);

        this.#imgWidth = tmpImg.width;
        this.#imgHeight = tmpImg.height;
        this.#currFrame = 0;
        this.#kills = 0;
        this.#bulletImage = bulletImage;

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

    get movement() { return this.#movement; }
    set movement(value) { this.#movement.x = value.x; this.#movement.y = value.y; }

    get kills() { return this.#kills; }
    set kills(value) { this.#kills = Number.parseInt(value); }

    lastActonCooldownRestart() { this.#lastActonCooldown = 150; }

    update(ctx, objects) {

        this.draw(ctx, enemy);
    }

    logic(objects, conn, astrpthfnd) {

        let enemy = this.findClostestEnemy(objects, astrpthfnd);

        if (!this.#attackMode && !this.#idle)
            this.checkCollisions(objects, enemy);

        let now = new Date();
        if (this.#attackMode &&
            (now.getTime() - this.#shotTimestamp
                > this.#shotFrequency) &&
            !this.checkLineOfFire(objects, enemy)
        ) {

            this.doShot(objects);

            this.#shotTimestamp = new Date().getTime();
        }


        if (this.#lastActonCooldown > 0) {
            this.#lastActonCooldown -= 1;
        } else {
            this.#movement = new Vector2d(0, 0);
        }

        this.move(objects, astrpthfnd);
    }

    checkLineOfFire(objects, enemy) {
        const soldierPos = new Vector2d(this.x, this.y);
        const enemyPos = new Vector2d(enemy.x, enemy.y);

        const direction = enemyPos.subtract(soldierPos);
        const lineLength = direction.getLength();

        let obscurificator = false;


        objects.foreach((obj) => {
            if (obj instanceof Bullet) {
                return false;
            }

            if (obj !== this && obj !== enemy) {
                const objPos = new Vector2d(obj.x, obj.y);

                if (obj instanceof RoundObject) {
                    // Handle round objects
                    const soldierToObj = objPos.subtract(soldierPos);
                    const projection = soldierToObj.dot(direction) / lineLength;

                    if (projection > 0 && projection < lineLength) {
                        const closestPointOnLine = soldierPos.add(direction.multiplyByFloat(projection / lineLength));
                        const distanceToLine = objPos.subtract(closestPointOnLine).getLength();

                        if (distanceToLine < obj.radius) {
                            obscurificator = true;
                            return true; // Exit loop early, we found an obstruction
                        }
                    }
                } else if (obj instanceof SquareObject) {
                    // Handle square objects
                    const halfWidth = obj.width / 2;
                    const halfHeight = obj.height / 2;

                    // Find the corners of the square
                    const corners = [
                        new Vector2d(obj.x - halfWidth, obj.y - halfHeight), // Top-left
                        new Vector2d(obj.x + halfWidth, obj.y - halfHeight), // Top-right
                        new Vector2d(obj.x - halfWidth, obj.y + halfHeight), // Bottom-left
                        new Vector2d(obj.x + halfWidth, obj.y + halfHeight)  // Bottom-right
                    ];

                    // Check if any of the square's edges intersect with the line of fire
                    for (let i = 0; i < corners.length; i++) {
                        const start = corners[i];
                        const end = corners[(i + 1) % corners.length];
                        if (Utils.lineIntersects(soldierPos, enemyPos, start, end)) {
                            obscurificator = true;
                            return true; // Exit loop early, we found an obstruction
                        }
                    }
                }
            }
        });

        return obscurificator; // No object is obscuring the line of fire
    }


    doShot(objects) {
        let bullet = new Bullet(
            this.x + (this.radius * Math.cos(this.#enemyAngle)),
            this.y + (this.radius * Math.sin(this.#enemyAngle)),
            new Vector2d(
                CONSTS.BULLET.VELOCITY * Math.cos(this.#enemyAngle),
                CONSTS.BULLET.VELOCITY * Math.sin(this.#enemyAngle)
            ),
            this,
            this.#bulletImage
        );

        objects.push(bullet);
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

    move(objectList, astrpthfnd) {
        let deltaX = 0;
        let deltaY = 0;

        if (this.#movement.x != 0 || this.#movement.y != 0) {

            deltaX = Math.round(this.#velocity * Math.cos(this.#forcedMovementAngle), 4);
            deltaY = Math.round(this.#velocity * Math.sin(this.#forcedMovementAngle), 4);

            this.x += deltaX;
            this.y += deltaY;

            if (astrpthfnd.checkObjsObjCollision(objectList, this)) {
                this.x -= deltaX;
                this.y -= deltaY;

                this.#movement.x = -this.#movement.x;
                this.#movement.y = -this.#movement.y;
            }

            if (this.x < 0 || this.x > CONSTS.GFX.ABS_WIDTH) {
                this.#movement.x = -this.#movement.x;
                this.x -= deltaX;
            }

            if (this.y < 0 || this.y > CONSTS.GFX.ABS_HEIGHT) {
                this.#movement.y = -this.#movement.y;
                this.y -= deltaY;
            }

        } else if (!this.#idle && !this.#attackMode) {

            let flagX = false;
            let flagY = false;

            for (let i = 0; i < 8; i++) {
                deltaX = Math.round(this.#velocity * Math.cos(this.#pathAngle), 4);
                deltaY = Math.round(this.#velocity * Math.sin(this.#pathAngle), 4);

                this.x += deltaX;

                if (astrpthfnd.checkObjsObjCollision(objectList, this)) {
                    this.x -= deltaX;

                    //this.#pathAngle += Math.PI / 8;
                } else
                    flagX = true;


                this.y += deltaY;

                if (astrpthfnd.checkObjsObjCollision(objectList, this)) {
                    this.y -= deltaY;

                    //this.#pathAngle += Math.PI / 8;
                } else
                    flagY = true;


                if (flagX && flagY)
                    break;
            }
        }
    }

    solveAngle(objects, astrpthfnd) {
        let closestObj = this.findClostestEnemy(objects, astrpthfnd);

        if (closestObj != null &&
            Utils.isPointInSquare(this.pos, 0, 0, CONSTS.GFX.ABS_WIDTH, CONSTS.GFX.ABS_HEIGHT) &&
            Utils.isPointInSquare(closestObj.pos, 0, 0, CONSTS.GFX.ABS_WIDTH, CONSTS.GFX.ABS_HEIGHT)
        ) {
            let startNode = astrpthfnd.getTile(this.x, this.y);
            let endNode = astrpthfnd.getTile(closestObj.x, closestObj.y);

            this.#path = astrpthfnd.aStar(
                startNode,
                endNode,
                [this, closestObj]
            );

            if (CONSTS.DEBUG && CONSTS.SHOW_GRID_SERVER_OUTPUT) {
                console.clear();
                astrpthfnd.printMap();
            }

            let nextStepX1 = this.x;
            let nextStepY1 = this.y;
            let nextStepX2 = closestObj.x;
            let nextStepY2 = closestObj.y;

            if (this.#path.length > 3) {
                nextStepX1 = astrpthfnd.trX(this.#path[0].x);
                nextStepY1 = astrpthfnd.trY(this.#path[0].y);
                nextStepX2 = astrpthfnd.trX(this.#path[3].x);
                nextStepY2 = astrpthfnd.trY(this.#path[3].y);
            }

            this.#pathAngle = Math.atan2(
                (nextStepY2 - nextStepY1),
                (nextStepX2 - nextStepX1)
            );

            this.#enemyAngle = Math.atan2(
                closestObj.y - this.y, closestObj.x - this.x
            );
        }
    }

    findClostestEnemy(objects, astrpthfnd) {
        let distance = Number.MAX_VALUE;
        let closestObj = null;

        objects.foreach((obj) => {
            if (
                obj.owner &&
                obj.owner.name != this.owner.name &&
                !(obj instanceof Wall)
            ) {
                let calculatedD = obj.pos.getDistance(this.pos);

                if (calculatedD < distance) {
                    distance = calculatedD;
                    closestObj = obj;
                }
            }
        });

        if (closestObj != null &&
            Utils.isPointInSquare(this.pos, 0, 0, CONSTS.GFX.ABS_WIDTH, CONSTS.GFX.ABS_HEIGHT) &&
            Utils.isPointInSquare(closestObj.pos, 0, 0, CONSTS.GFX.ABS_WIDTH, CONSTS.GFX.ABS_HEIGHT)
        ) {
            let enemyDir = new Vector2d(closestObj.x - this.x, closestObj.y - this.y);
            let absDir = enemyDir.add(this.#movement);

            this.#angle = Math.atan2(
                absDir.y, absDir.x
            );

            this.#forcedMovementAngle = Math.atan2(this.#movement.y, this.#movement.x);

            this.#attackMode = this.#attackDistance > distance && !this.checkLineOfFire(objects, closestObj);
        } else {
            this.#idle = true;
        }

        return closestObj;
    }

    lumbago(value, objects) {
        this.hp -= value;

        if (this.hp <= 0) {
            this.#image = "bang";
            this.owner = null;

            setTimeout(function () {
                objects.delete(this);
            }.bind(this), 1000);

            return true;
        }

        return false;
    }

    toDTO() {
        let dto = super.toDTO();

        dto.image = this.#image;
        dto.velocity = this.#velocity;
        dto.attackDistance = this.#attackDistance;
        dto.angle = this.#angle;
        dto.attackMode = this.#attackMode;
        dto.idle = this.#idle;
        dto.shotFrequency = this.#shotFrequency;
        dto.shotTimestamp = this.#shotTimestamp;
        dto.imgWidth = this.#imgWidth;
        dto.imgHeight = this.#imgHeight;
        dto.currFrame = 0;
        dto.kills = this.#kills;
        dto.bulletImage = this.#bulletImage;
        dto.type = this.constructor.name;
        dto.movement = this.#movement.toDTO();
        dto.path = Utils.serializePath(this.#path);

        return dto;
    }

    static fromDTO(dto, obj = new Soldier(
        dto.x,
        dto.y,
        dto.image,
        dto.bulletImage,
        Player.fromDTO(dto.owner))) {

        super.fromDTO(dto, obj);

        obj.#angle = dto.angle;
        obj.#attackMode = dto.attackMode;
        obj.#imgWidth = dto.imgWidth;
        obj.#imgHeight = dto.imgHeight;
        obj.#kills = dto.kills;

        return obj;
    }

    sync(dto) {
        super.sync(dto);
    }
}