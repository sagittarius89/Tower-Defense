class Ball extends GameObject {
    #position;
    #velocity;
    #color;
    #radius

    constructor(x, y, color, r) {
        super();

        /**
         * @member {Vector2d}
         */
        this.#position = new Vector2d(x, y);
        /**
         * @member {Vector2d}
         */
        this.#velocity = new Vector2d(0, 0);
        /**
         * @member {String}
         */
        this.#color = color;

        if (r)
            this.#radius = r;
        else
            this.#radius = Physics.radius;

        this.addProperty(
            Collider.OBJECT_PROPERTY,
            Collider.COLLIDER_OBJECT_DATA(ColliderShape.CIRCLE, false)
        );
    }

    get position() { return this.#position; }
    get velocity() { return this.#velocity; }
    get color() { return this.#color; }
    get radius() { return this.#radius; }

    /**
     * @param {Vector2d} vector
     */
    set position(vector) { this.#position = vector; }

    /**
     * @param {Vector2d} vector
     */
    set velocity(vector) { this.#velocity = vector; }

    update(ctx, objects, collider, camera) {
        super.update(ctx, objects, collider);

        this.#position = this.#position.add(this.#velocity);

        this.render(ctx, camera);
    }

    render(ctx, camera) {
        ctx.beginPath();
        ctx.arc(this.position.x - camera.x, this.position.y - camera.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        ctx.closePath();
    }
}