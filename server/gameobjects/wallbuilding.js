const Building = require('./building');
const Vector2d = require('../../game/static/src/math/vector').Vector2d;
const CONSTS = require('../../shared/consts').CONSTS;


module.exports = class Wall extends Building {
    #orientation;

    get orientation() { return this.#orientation; }

    constructor(pos, orientation) {
        super(null, null, pos.x, pos.y,
            CONSTS.WALL[orientation].WIDTH,
            CONSTS.WALL[orientation].HEIGHT,
            'blue');


        this.#orientation = orientation;
        this.syncable = true;
        this.selectable = true;
        this.zIndex = 10;
    }

    update(ctx, objects) {
        super.update(ctx, objects);
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
