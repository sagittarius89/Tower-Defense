const Building = require('./building');
const Vector2d = require('../../game/static/src/math/vector').Vector2d;
const Bullet = require('./bullet');
const CONSTS = require('../../shared/consts').CONSTS;

module.exports = class Tower extends Building {
    #spawnPoint;
    #attackDistance;
    #attackMode;
    #shotFrequency;
    #shotTimestamp;
    #bulletImage;
    #angle;
    #kills;

    get kills() { return this.#kills; }
    set kills(value) { this.#kills = Number.parseInt(value); }

    constructor(pos, spawnPoint, image, imageSelected, bulletImage) {
        super(image, imageSelected, pos.x, pos.y, CONSTS.TOWER.RADIUS, CONSTS.TOWER.RADIUS);

        this.#spawnPoint = spawnPoint;
        this.#bulletImage = bulletImage;
        this.#attackDistance = CONSTS.TOWER.ATTACK_DISTANCE;
        this.hp = CONSTS.TOWER.HP;
        this.maxHp = CONSTS.TOWER.HP;
        this.#shotFrequency = CONSTS.TOWER.SHOT_FREQUENCY;
        this.#attackMode = false;
        this.idle = false;
        this.#shotTimestamp = new Date().getTime();

        this.selectable = true;
        this.name = "Impulse Tower";
        this.zIndex = 70;
    }

    doShot(objects) {
        let bullet = new Bullet(
            this.#spawnPoint.x,
            this.#spawnPoint.y,
            new Vector2d(
                CONSTS.BULLET.VELOCITY * Math.cos(this.#angle),
                CONSTS.BULLET.VELOCITY * Math.sin(this.#angle)
            ),
            this,
            this.#bulletImage
        );

        objects.push(bullet);
    }


    findClostestEnemy(objects) {
        let distance = Number.MAX_VALUE;
        let closestObj = null;

        objects.foreach((obj) => {

            if (obj.owner && obj.owner.name != this.owner.name) {


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
                closestObj.y - this.#spawnPoint.y, closestObj.x - this.#spawnPoint.x
            );

            if (this.#attackDistance > distance) {
                this.#attackMode = true;
            } else {
                this.#attackMode = false;
            }

        } else {
            this.idle = true;
        }

        return closestObj;
    }

    update(ctx, objects) {
        super.update(ctx, objects);
    }

    logic(objects) {
        this.findClostestEnemy(objects);

        let now = new Date();
        if (this.#attackMode &&
            (now.getTime() - this.#shotTimestamp
                > this.#shotFrequency)
        ) {
            //this.doShot(objects);

            this.#shotTimestamp = new Date().getTime();
        }
    }

    toDTO() {
        let dto = super.toDTO();

        dto.type = this.constructor.name;
        dto.attackDistance = this.#attackDistance;
        dto.attackMode = this.#attackMode;
        dto.shotFrequency = this.#shotFrequency;
        dto.shotTimestamp = this.#shotTimestamp;
        dto.angle = this.#angle;
        dto.kills = this.#kills;
        dto.spawnPoint = this.#spawnPoint.toDTO();

        return dto;
    }

    static fromDTO(dto, obj = new Tower(
        new Vector2d(dto.x, dto.y),
        Vector2d.fromDTO(dto.spawnPoint),
        dto.image,
        dto.imageSelected,
        dto.bulletImage)
    ) {
        super.fromDTO(dto, obj);

        obj.#attackMode = dto.attackMode;
        obj.#angle = dto.angle;
        obj.#kills = dto.kills;
        obj.#shotFrequency = dto.shotFrequency;
        obj.#shotTimestamp = dto.shotTimestamp;
        obj.#spawnPoint = Vector2d.fromDTO(dto.spawnPoint);
        obj.#attackDistance = dto.attackDistance;
        obj.#attackMode = dto.attackMode;
        obj.#kills = dto.kills;

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        //this.#angle = dto.angle;
        //this.#kills = dto.kills;
    }
}
