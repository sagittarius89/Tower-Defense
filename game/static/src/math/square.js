class Square {
    #position;
    #dimension;

    constructor(x, y, width, height) {
        this.#position = new Vector2d(x, y);
        this.#dimension = new Vector2d(width, height);
    }

    get pos() { return this.#position; }
    get x() { return this.#position.x; }
    get y() { return this.#position.y; }
    get width() { return this.#dimension.x; }
    get height() { return this.#dimension.y; }
    get topLeft() {
        return new Vector2d(
            this.#position.x - this.#dimension.x / 2,
            this.#position.y - this.#dimension.y / 2);
    }
    get topRight() {
        return new Vector2d(
            this.#position.x + this.#dimension.x / 2,
            this.#position.y - this.#dimension.y / 2);
    }
    get bottomLeft() {
        return new Vector2d(
            this.#position.x - this.#dimension.x / 2,
            this.#position.y + this.#dimension.y / 2);
    }

    get bottomRight() {
        return new Vector2d(
            this.#position.x + this.#dimension.x / 2,
            this.#position.y + this.#dimension.y / 2);
    }

    set x(value) { this.#position.x = Number.parseFloat(value); }
    set y(value) { this.#position.y = Number.parseFloat(value); }
    set width(value) { this.#position.width = Number.parseFloat(value); }
    set height(value) { this.#position.height = Number.parseFloat(value); }
}

try {
    module.exports = {
        Square
    }
} catch (e) { }