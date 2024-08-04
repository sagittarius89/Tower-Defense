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
        super(CONSTS.TOWER.RADIUS, CONSTS.TOWER.RADIUS, pos.x, pos.y, 'blue');

        this.#spawnPoint = spawnPoint;
        this.#bulletImage = bulletImage;
        this.#attackDistance = CONSTS.TOWER.ATTACK_DISTANCE;
        this.hp = CONSTS.TOWER.HP;
        this.maxHp = CONSTS.TOWER.HP;
        this.#shotFrequency = CONSTS.TOWER.SHOT_FREQUENCY;
        this.#attackMode = false;
        this.idle = false;
        this.#shotTimestamp = new Date().getTime();
        this.#angle = 0;

        this.selectable = true;
        this.name = "Impulse Tower";
        this.zIndex = 20;
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
        if (CONSTS.BLOCKOUT) {
            this.blockout(ctx, objects);
        } else {
            super.update(ctx, objects);
        }
    }

    blockout(ctx, objects) {


        if (this.hp > 0)
            ctx.fillStyle = 'lightgreen';

        ctx.beginPath();
        ctx.ellipse(CTX.trX(this.x), CTX.trY(this.y), CTX.trX(this.width), CTX.trHeight(this.height), 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 0, 1)';
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        CTX.setTransform(1, 0, 0, 1, this.x, this.y); // set position of image center

        ctx.lineWidth = 5;
        ctx.beginPath();
        CTX.moveTo(0, 0);
        CTX.lineTo(this.width * 1.2, 0, this.#angle);
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = 1;

        ctx.fillStyle = "red";
        CTX.drawRect(-5, -5, 10, 10);


        if (this.hp > 0) {
            drawHpStripe(ctx, this.maxHp, this.hp,
                -this.width / 2,
                -this.height * 1.2,
                this.width * 1.5, 10);
        }

        drawStrokedTextAbs(ctx,
            `${Math.floor(CTX.trX(this.x))} ${Math.floor(CTX.trY(this.y))} ${this.#angle}`,
            -CTX.trX(this.width) / 2, -CTX.trHeight(this.height) * 1.5, 10);

        CTX.setTransform(1, 0, 0, 1, 0, 0);


    }


    logic(objects) {

    }

    toDTO() {
        let dto = super.toDTO();

        dto.attackDistance = this.#attackDistance;
        dto.attackMode = this.#attackMode;
        dto.shotFrequency = this.#shotFrequency;
        dto.shotTimestamp = this.#shotTimestamp;
        dto.angle = this.#angle;
        dto.kills = this.#kills;
        dto.bulletImage = this.#bulletImage;
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
        this.#angle = dto.angle;
        this.#kills = dto.kills;
    }
}
