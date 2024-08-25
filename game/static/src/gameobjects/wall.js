class Wall extends Building {
    #orientation;


    get orientation() { return this.#orientation; }


    constructor(pos, orientation) {
        super(
            CONSTS.WALL[orientation].WIDTH,
            CONSTS.WALL[orientation].HEIGHT,
            pos.x, pos.y, 'blue');

        this.#orientation = orientation;

    }


    update(ctx, objects) {
        if (CONSTS.BLOCKOUT) {
            this.blockout(ctx, objects);
        } else {
            super.update(ctx, objects);
        }
    }

    blockout(ctx) {
        Wall.blockout(ctx, this.x, this.y, this.width, this.height);
    }

    static blockout(ctx, x, y, width, height) {
        ctx.fillStyle = '#C14A09';
        ctx.strokeStyle = 'black';

        ctx.beginPath();
        CTX.drawRect(
            x - width / 2,
            y - height / 2,
            width,
            height);
        ctx.fill();
        ctx.stroke();
    }


    logic() {

    }

    toDTO() {
        let dto = super.toDTO();

        dto.orientation = this.#orientation;

        dto.type = this.constructor.name;
        return dto;
    }

    static fromDTO(dto, obj =
        new Wall(new Vector2d(dto.x, dto.y), dto.orientation)) {
        super.fromDTO(dto, obj);

        obj.#orientation = dto.orientation;

        return obj;
    }

    sync(dto) {
        super.sync(dto);
    }
}
