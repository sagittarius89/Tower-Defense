const GameObject = require('../gameobject');
const Square = require('./square');

module.exports = class SquareObject extends GameObject {
    #square;

    constructor(width, height, x, y) {
        super();

        this.#square = new Square(x, y, width, height);
    }

    get width() { return this.#square.width; }
    get height() { return this.#square.height; }
    get x() { return this.#square.x; }
    get y() { return this.#square.y; }
    get pos() {
        return this.#square.pos;
    }
    set x(value) { this.#square.x = value; }
    set y(value) { this.#square.y = value; }
    set width(value) { this.#square.width = value; }
    set height(value) { this.#square.heighty = value; }

    toSquare() {
        return this.#square;
    }

    toDTO() {
        let dto = super.toDTO();

        dto.x = this.x;
        dto.y = this.y;
        dto.width = this.width;
        dto.height = this.height;
        dto.type = this.constructor.name;

        return dto;
    }

    static fromDTO(dto, obj = new SquareObject(
        dto.width,
        dto.height,
        dto.x,
        dto.y
    )) {
        super.fromDTO(dto, obj);

        return obj;
    }

    sync(dto) {
        super.sync(dto)

        this.x = dto.x;
        this.y = dto.y;
        this.width = dto.width;
        this.height = dto.height;
    }
}