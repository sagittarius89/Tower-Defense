class SquareObject extends GameObject {
    #square;

    constructor(width, height, x, y) {
        super();

        this.#square = new Square(x, y, width, height);
    }

    get width() { return this.#square.width; }
    get height() { return this.#square.height; }
    get x() { return this.#square.x; }
    get y() { return this.#square.y; }
    set x(value) { this.#square.x = value; }
    set y(value) { this.#square.y = value; }
    set width(value) { this.#square.width = value; }
    set height(value) { this.#square.heighty = value; }

    toSquare() {
        return this.#square.clone();
    }

    pos() {
        return this.#square.pos.clone();
    }

    toDTO() {
        let dto = super.toDTO();

        dto.x = this.x;
        dto.y = this.y;
        dto.width = this.width;
        dto.height = this.height;

        return dto;
    }

    static fromDTO(dto, obj = new SquareObject(0, 0, 0, 0)) {
        super.fromDTO(dto, obj);

        obj.x = dto.x;
        obj.y = dto.y;
        obj.width = dto.width;
        obj.height = dto.height;

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