class Surface extends GameObject {
    #startPoint
    #length
    #orientation

    /**
     * 
     * @param {Vector2d} startPoint 
     * @param {number} length 
     * @param {Orientation} orientation 
     */
    constructor(startPoint, length, orientation) {
        super();

        this.#startPoint = startPoint;
        this.#length = length;
        this.#orientation = orientation;

        this.addProperty(
            Collider.OBJECT_PROPERTY,
            Collider.COLLIDER_OBJECT_DATA(ColliderShape.SURFACE, true)
        );
    }

    get startPoint() { return this.#startPoint; }
    get length() { return this.#length; }
    get orientation() { return this.#orientation; }

    update(ctx, objects, collider, camera) {
        this.render(ctx, camera);
    }

    render(ctx, camera) {
        ctx.beginPath();
        ctx.moveTo(this.#startPoint.x - camera.x, this.#startPoint.y - camera.y);
        ctx.lineWidth = 10;

        switch (this.#orientation) {
            case Orientation.HORIZONTAL:
                ctx.lineTo(this.#startPoint.x + this.#length - camera.x, this.#startPoint.y - camera.y);
                break;
            case Orientation.VERTICAL:
                ctx.lineTo(this.#startPoint.x - camera.x, this.#startPoint.y + this.#length - camera.y);
                break;
        }

        ctx.stroke();
        ctx.closePath();
    }
}