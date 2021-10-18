class Tower extends Building {
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
        super(image, imageSelected, pos.x, pos.y);

        this.#spawnPoint = spawnPoint;
        this.#bulletImage = bulletImage;
        this.#attackDistance = 400;
        this.#attackMode = false;
        this.idle = false;
        this.#shotTimestamp = new Date().getTime();
        this.#shotFrequency = 1000;

        this.selectable = true;
        this.hp = 250;
        this.maxHp = 250;
        this.name = "Impulse Tower";
        this.zIndex = 70;
        this.syncable = true;
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

    }

    toDTO() {
        let dto = super.toDTO();

        dto.attackDistance = this.attackDistance;
        dto.attackMode = this.attackMode;
        dto.shotFrequency = this.shotFrequency;
        dto.shotTimestamp = this.shotTimestamp;
        dto.angle = this.angle;
        dto.kills = this.kills;
        dto.spawnPoint = this.#spawnPoint.toDTO();

        dto.type = this.constructor.name;
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

        obj.#attackDistance = dto.attackDistance;
        obj.#attackMode = dto.attackMode;
        obj.#shotFrequency = dto.shotFrequency;
        obj.#shotTimestamp = dto.shotTimestamp;
        obj.#angle = dto.angle;
        obj.#kills = dto.kills;

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        this.#attackDistance = dto.attackDistance;
        this.#attackMode = dto.attackMode;
        this.#shotFrequency = dto.shotFrequency;
        this.#shotTimestamp = dto.shotTimestamp;
        this.#angle = dto.angle;
        this.#kills = dto.kills;
    }
}
