const GameObject = require('../gameobject');
const Vector2d = require('../../game/static/src/math/vector').Vector2d;
module.exports = class RoundObject extends GameObject {
    #pos;
    #radius;

    constructor(radius, x, y) {
        super();

        this.#pos = new Vector2d(x, y);
        this.#radius = radius;
    }

    get x() { return this.#pos.x; }
    get y() { return this.#pos.y; }
    get radius() { return this.#radius; }
    set x(value) { this.#pos.x = value; }
    set y(value) { this.#pos.y = value; }
    set radius(value) { return this.#radius = value; }
    get pos() { return this.#pos.clone(); }

    toDTO() {
        let dto = super.toDTO();

        dto.pos = this.#pos.toDTO();
        dto.radius = this.#radius;
        dto.type = this.constructor.name;

        return dto;
    }

    static fromDTO(dto, obj = new RoundObject(0, 0, 0)) {
        super.fromDTO(dto, obj);

        obj.#pos = Vector2d.fromDTO(dto.pos);
        obj.#radius = dto.radius;

        return obj;
    }

    sync(dto) {
        super.sync(dto)

        this.#pos = Vector2d.fromDTO(dto.pos);
        this.#radius = dto.radius;
    }
}