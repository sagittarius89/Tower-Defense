class Square {
    #position;
    #dimension;

    constructor(x, y, width, height) {
        this.#position = new Vector2d(x, y);
        this.#dimension = new Vector2d(width, height);
    }

    get x() { return this.#position.x; }
    get y() { return this.#position.y; }
    get width() { return this.#dimension.x; }
    get height() { return this.#dimension.y; }
    get topLeft() { return new Vector2d(this.#position.x, this.#position.y); }
    get topRight() {
        return new Vector2d(this.#position.x + this.#dimension.x,
            this.#position.y);
    }
    get bottomLeft() {
        return new Vector2d(this.#position.x,
            this.#position.y + this.#dimension.y);
    }

    get bottomRight() {
        return new Vector2d(this.#position.x + this.#dimension.x,
            this.#position.y + this.#dimension.y);
    }
}