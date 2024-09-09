const Building = require('./building');
const Vector2d = require('../../game/static/src/math/vector').Vector2d;
const Bullet = require('./bullet');
const CONSTS = require('../../shared/consts').CONSTS;

module.exports = class Spawn extends Building {
    #spawnPoint;
    #productionTimestamp;
    #spawnFrequency;
    #angle;
    #soldierType;
    #dronImage;
    #bulletImage;

    constructor(pos, spawnPoint, player, soldierType, angle, spawnFrequency, dronImage, bulletImage) {
        super(dronImage, bulletImage, pos.x, pos.y, CONSTS.SPAWN.WIDTH, CONSTS.SPAWN.HEIGHT);

        this.#spawnPoint = spawnPoint;
        this.hp = CONSTS.SPAWN.HP;
        this.maxHp = CONSTS.SPAWN.HP;
        this.#productionTimestamp = new Date().getTime();
        this.#angle = angle;
        this.#soldierType = soldierType;
        this.#dronImage = dronImage;
        this.#bulletImage = bulletImage;
        this.#spawnFrequency = spawnFrequency;

        this.owner = player;
        this.selectable = false;
        this.name = "Spawn";
        this.zIndex = 20;
        this.syncable = true;
    }

    update(ctx, objects) {
        super.update(ctx, objects);
    }

    produceNewSoldier(objects) {
        let soldier = new Soldier(this.#spawnPoint.x, this.#spawnPoint.y,
            this.#dronImage, this.#bulletImage, this.owner, this.#soldierType);

        objects.push(soldier);
    }

    soldierCount(objects) {
        let count = 0;
        objects.foreach((obj) => {
            if (obj instanceof Soldier && obj.owner == this.owner) {
                count++;
            }
        });

        return count;
    }

    logic(objects, conn, astrpthfnd, cont) {
        let now = new Date();

        if (cont) {
            if (now.getTime() - this.#productionTimestamp
                > this.#spawnFrequency &&
                CONSTS.SPAWN.SOLDIER_LIMIT > this.soldierCount(objects)) {

                this.produceNewSoldier(objects);

                this.#productionTimestamp = new Date().getTime();
            }
        }
        else {
            this.#productionTimestamp = new Date().getTime();
        }
    }

    toDTO() {
        let dto = super.toDTO();

        dto.type = this.constructor.name;
        dto.angle = this.#angle;
        dto.spawnPoint = this.#spawnPoint.toDTO();
        dto.soldierType = this.#soldierType;
        dto.dronImage = this.#dronImage;
        dto.bulletImage = this.#bulletImage;
        dto.productionTimestamp = this.#productionTimestamp;

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

        return obj;
    }

    sync(dto) {
        super.sync(dto);
    }
}
