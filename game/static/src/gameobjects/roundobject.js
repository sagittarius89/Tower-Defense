class RoundObject extends GameObject {
    #x;
    #y;
    #radius;

    constructor(radius, x, y) {
        super();

        this.#x = x;
        this.#y = y;
        this.#radius = radius;
    }

    get x() { return this.#x; }
    get y() { return this.#y; }
    get radius() { return this.#radius; }
    set x(value) { this.#x = value; }
    set y(value) { this.#y = value; }
}