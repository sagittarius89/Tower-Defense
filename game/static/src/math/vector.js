class Vector2d {
    #x;
    #y;

    constructor(x, y) {

        /** @member {number} */
        this.#x = x;

        /** @member {number} */
        this.#y = y;
    }

    get x() { return this.#x; }

    get y() { return this.#y; }

    /** @param {Vector2d} vector - vector2d */
    add(vector) {
        return new Vector2d(this.x + vector.x, this.y + vector.y);
    }

    /** @param {Vector2d} vector - vector2d */
    substract(vector) {
        return new Vector2d(this.x - vector.x, this.y - vector.y);
    }

    /** @param {Vector2d} vector - vector2d */
    multiply(vector) {
        return new Vector2d(this.x * vector.x, this.y * vector.y);
    }

    /** @param {Vector2d} vector - vector2d */
    divide(vector) {
        var subX = this.x / vector.x;
        var subY = this.y / vector.y;

        return new Vector2d(subX, subY);
    }

    /** @param {number} f - number */
    multiplyByFloat(f) {
        return new Vector2d(this.x * f, this.y * f);
    }

    /** @param {number} f - number */
    divideByFloat(f) {
        return new Vector2d(this.x / f, this.y / f);
    }

    /** @param {Vector2d} vector - vector2d */
    getDistance(vector) {
        return Math.sqrt(
            Math.pow(this.x - vector.x, 2) +
            Math.pow(this.y - vector.y, 2)
        );
    }

    /** @param {number} angle - angle in rad */
    rotate(angle) {
        var ca = Math.cos(angle);
        var sa = Math.sin(angle);
        this.x = this.x * ca + this.y * sa;
        this.y = this.x * sa - this.y * ca;
    }

    getLength() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }

    getSquaredLength() {
        return (this.x * this.x) + (this.y * this.y);
    }

    /** @param {Vector2d} vector - vector2d */
    dot(vector) {
        return this.x * vector.x + this.y * vector.y;
    }

    normalize() {
        var scalefactor;
        var length = this.getLength();

        //return if length is 1 or 0
        if (length == 1 || length == 0) {
            return;
        }
        scalefactor = 1.0 / length;

        return new Vector2d(this.x * scalefactor, this.y * scalefactor);
    }
}