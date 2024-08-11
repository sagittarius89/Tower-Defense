const RoundObject = require('./roundobject');
const ResourceManager = require('../resourcemanager').ResourceManager;
const Player = require('../../shared/player.js').Player;
const Vector2d = require('../../game/static/src/math/vector').Vector2d;
const Bullet = require('./bullet');
const Collider = require('../../game/static/src/physics/collider').Collider;
const ColliderShape = require('../../game/static/src/physics/collider').ColliderShape;
const CONSTS = require('../../shared/consts').CONSTS;
const Utils = require('../../shared/utils.js');

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
    #enemyAngle;
    #movementAngle;
    #lastActonCooldown;
    #path;

    constructor(x, y, dronImage, bulletImage, owner) {
        let tmpImg = ResourceManager.instance.getImageResource(dronImage);
        super(CONSTS.SOLDIER.RADIUS, x, y);

        this.#image = dronImage;
        this.#angle = 0;
        this.#enemyAngle = 0;
        this.#movementAngle = 0;
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
                > this.#shotFrequency)
        ) {

            this.doShot(objects);

            this.#shotTimestamp = new Date().getTime();
        }


        if (this.#lastActonCooldown > 0) {
            this.#lastActonCooldown -= 1;
        } else {
            this.#movement = new Vector2d(0, 0);
        }

        this.move();
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

    move() {
        if (this.#movement.x != 0 || this.#movement.y != 0) {
            this.x += this.#velocity * Math.cos(this.#movementAngle);
            this.y += this.#velocity * Math.sin(this.#movementAngle);
        } else if (!this.#idle && !this.#attackMode) {
            this.x += this.#velocity * Math.cos(this.#enemyAngle);
            this.y += this.#velocity * Math.sin(this.#enemyAngle);
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

            this.#path = astrpthfnd.aStar(startNode, endNode);

            console.clear();
            astrpthfnd.printMap();

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

            this.#enemyAngle = Math.atan(
                (nextStepY2 - nextStepY1) / (nextStepX2 - nextStepX1)
            );
        }
    }

    findClostestEnemy(objects, astrpthfnd) {
        let distance = Number.MAX_VALUE;
        let closestObj = null;

        objects.foreach((obj) => {

            if (obj.owner && obj.owner.name != this.owner.name) {
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
            //let startNode = astrpthfnd.getTile(this.x, this.y);
            //let endNode = astrpthfnd.getTile(closestObj.x, closestObj.y);

            //this.#path = astrpthfnd.aStar(startNode, endNode);

            //let nextStepX1 = closestObj.x;
            //let nextStepY1 = closestObj.y;
            //let nextStepX2 = this.x;
            //let nextStepY2 = this.y;

            //if (this.#path.length > 1) {
            //    nextStepX1 = astrpthfnd.trX(this.#path[0].x);
            //    nextStepY1 = astrpthfnd.trY(this.#path[0].y);
            //    nextStepX2 = astrpthfnd.trX(this.#path[1].x);
            //    nextStepY2 = astrpthfnd.trY(this.#path[1].y);
            // }


            let enemyDir = new Vector2d(closestObj.x - this.x, closestObj.y - this.y);
            let absDir = enemyDir.add(this.#movement);

            this.#angle = Math.atan2(
                absDir.y, absDir.x
            );

            this.#movementAngle = Math.atan2(this.#movement.y, this.#movement.x);

            //this.#enemyAngle = Math.atan(
            //    (nextStepY2 - nextStepY1) / (nextStepX2 - nextStepX1)
            //);

            this.#attackMode = this.#attackDistance > distance;
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