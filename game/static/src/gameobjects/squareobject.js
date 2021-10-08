class SquareObject extends GameObject {
    #x;
    #y;
    #width;
    #height;

    constructor(width, height, x, y) {
        super();
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
    }

    get width() { return this.#width; }
    get height() { return this.#height; }
    get x() { return this.#x; }
    get y() { return this.#y; }
    set x(value) { this.#x = value; }
    set y(value) { this.#y = value; }

    toSquare() {
        return new Square(this.x, this.y, this.width, this.height);
    }

}