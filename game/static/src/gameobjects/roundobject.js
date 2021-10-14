class RoundObject extends GameObject {
    #pos;
    #radius;

    constructor(radius, x, y) {
        super();

        this.#pos = new Vector2d(x, y);
        this.#radius = radius;
    }

    get x() { return this.#post.x; }
    get y() { return this.#post.y; }
    get radius() { return this.#radius; }
    set x(value) { this.#pos.x = Number.parseFloat(value); }
    set y(value) { this.#pos.y = Number.parseFloat(value); }
    set radius(value) { return this.#radius = Number.parseFloat(value); }
    get pos() { return this.#pos.clone(); }

    toDTO() {
        let dto = super.toDTO();

        dto.pos = this.#pos.toDTO();
        dto.radius = this.#radius;

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

        this.x = dto.x;
        this.y = dto.y;
        this.radius = dto.radius;
    }
}