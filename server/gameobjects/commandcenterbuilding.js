const Building = require('./building');
const Player = require("../../shared/player");
const Soldier = require("./soldier");
const Vector2d = require('../../game/static/src/math/vector').Vector2d;

module.exports = class CommandCenterBuilding extends Building {
    #productionTimestamp;
    #spawnPoint;
    #spawnFrequency;
    #soldierLimit;
    #dronImage;
    #bulletImage;
    #towerImage;
    #towerImageSelected;

    constructor(pos, spawnPoint, player,
        image, imageSelected,
        dronImage, bulletImage,
        towerImage, towerImageSelected) {

        super(image, imageSelected, pos.x, pos.y);

        this.#productionTimestamp = new Date().getTime();
        this.#spawnFrequency = 3 * 1000;
        this.#spawnPoint = spawnPoint;
        this.#soldierLimit = 15;
        this.#dronImage = dronImage;
        this.#bulletImage = bulletImage;
        this.#towerImage = towerImage;
        this.#towerImageSelected = towerImageSelected;


        this.owner = player;
        this.selectable = true;
        this.syncable = true;
        this.hp = 1000;
        this.maxHp = 1000;
        this.name = "Command Center";
        this.zIndex = 30;
    }

    produceNewSoldier(objects) {
        let soldier = new Soldier(this.#spawnPoint.x, this.#spawnPoint.y,
            this.#dronImage, this.#bulletImage, this.owner);

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

    logic(objects) {
        let now = new Date();

        if (now.getTime() - this.#productionTimestamp
            > this.#spawnFrequency &&
            this.#soldierLimit > this.soldierCount(objects)) {

            this.produceNewSoldier(objects);

            this.#productionTimestamp = new Date().getTime();
        }
    }

    toDTO() {
        let dto = super.toDTO();


        dto.productionTimestamp = this.#productionTimestamp;
        dto.spawnPoint = this.#spawnPoint.toDTO();
        dto.spawnFrequency = this.#spawnFrequency;
        dto.soldierLimit = this.#soldierLimit;
        dto.dronImage = this.#dronImage;
        dto.bulletImage = this.#bulletImage;
        dto.towerImage = this.#towerImage;
        dto.towerImageSelected = this.#towerImageSelected;

        dto.type = this.constructor.name;
        return dto;
    }

    static fromDTO(dto, obj = new CommandCenterBuilding(
        Vector2d.fromDTO(dto.x, dto.y),
        Vector2d.fromDTO(dto.spawnPoint),
        Player.fromDTO(dto.owner),
        obj.image, obj.imageSelected, obj.dronImage, obj.bulletImage,
        obj.towerImage, obj.towerImageSelected
    )) {

        super.fromDTO(dto, obj);

        obj.#productionTimestamp = dto.productionTimestamp;
        obj.#spawnFrequency = dto.spawnFrequency;
        obj.#soldierLimit = dto.soldierLimit;
        obj.#dronImage = dto.dronImage;
        obj.#bulletImage = dto.bulletImage;
        obj.#towerImage = dto.towerImage;
        obj.#towerImageSelected = dto.towerImageSelected;

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        this.#productionTimestamp = dto.productionTimestamp;
        this.#spawnPoint = Vector2d.fromDTO(dto.spawnPoint);
        this.#spawnFrequency = dto.spawnFrequency;
        this.#soldierLimit = dto.soldierLimit;
        this.#dronImage = dto.dronImage;
        this.#bulletImage = dto.bulletImage;
    }
}