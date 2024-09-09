class Spawn extends Building {
    #spawnPoint;
    #productionTimestamp;
    #angle;
    #soldierType;

    constructor(pos, spawnPoint, soldierType, angle) {
        super(CONSTS.SPAWN.WIDTH, CONSTS.SPAWN.HEIGHT, pos.x, pos.y, 'blue');

        this.#spawnPoint = spawnPoint;
        this.hp = CONSTS.TOWER.HP;
        this.maxHp = CONSTS.TOWER.HP;
        this.#productionTimestamp = new Date().getTime();
        this.#angle = angle;
        this.#soldierType = soldierType;

        this.selectable = false;
        this.name = "Spawn";
        this.zIndex = 20;
        this.syncable = true;
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


        CTX.setTransform(1, 0, 0, 1, this.x, this.y);

        ctx.beginPath();
        CTX.moveTo(0, 0, this.#angle);

        CTX.lineTo(-this.width / 2, this.height / 2, this.#angle);
        CTX.lineTo(this.width / 2, this.height / 2, this.#angle);
        CTX.lineTo(this.width / 2, -this.height / 2, this.#angle);
        CTX.lineTo(-this.width / 2, -this.height / 2, this.#angle);
        CTX.lineTo(-this.width / 2, this.height / 2, this.#angle);

        ctx.stroke();
        ctx.fill();
        ctx.closePath();

        if (this.hp > 0) {
            drawHpStripe(ctx, this.maxHp, this.hp,
                -this.width / 2,
                -this.height * 1.2,
                this.width * 1.5, 10);
        }

        if (CONSTS.DEBUG) {
            drawStrokedTextAbs(ctx,
                `${Math.floor(CTX.trX(this.x))} ${Math.floor(CTX.trY(this.y))}`,
                -CTX.trX(this.width) / 2, -CTX.trHeight(this.height) * 1.5, 10);
        }

        CTX.setTransform(1, 0, 0, 1, 0, 0);
    }


    logic(objects) {

    }

    toDTO() {
        let dto = super.toDTO();

        dto.type = this.constructor.name;
        return dto;
    }

    static fromDTO(dto, obj = new Spawn(
        new Vector2d(dto.x, dto.y),
        Vector2d.fromDTO(dto.spawnPoint),
        dto.soldierType,
        dto.angle)
    ) {
        super.fromDTO(dto, obj);

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        this.#productionTimestamp = dto.productionTimestamp;
    }
}
