class GameEngine {
    #ctx;
    #objects;
    #collider;
    #camera;

    /** @param {CanvasRenderingContext2D} ctx */
    constructor(ctx) {
        /** @member {CanvasRenderingContext2D} */
        this.#ctx = ctx;

        /** @member {GameObjectList} */
        this.#objects = new GameObjectList();
        this.#collider = new Collider();
        this.#camera = new Camera(new Vector2d(0, 0));

        this.addObject(this.#camera);
    }

    get ctx() { return this.#ctx; }

    /**
     * 
     * @param {GameObject} object 
     */
    addObject(object) {
        this.#objects.push(object);
    }

    get objects() { return this.#objects; }

    get WIDTH() { return this.ctx.canvas.width }
    get HEIGHT() { return this.ctx.canvas.height; }

    get camera() { return this.#camera; }
    set camera(camera) {
        this.#objects.delete(this.#camera);
        this.#camera = camera;

        addObject(this.#camera);
    }

    start() {
        this.continue = true;

        setTimeout(this.update, 20, this.#ctx, this.#objects, this.#collider, this.#camera, this);
    }

    update(ctx, objects, collider, camera, instance) {
        ctx.clearRect(0, 0, instance.WIDTH, instance.HEIGHT);

        objects.foreach((obj) => {
            obj.update(ctx, objects, collider, camera);
        });

        if (instance.continue)
            setTimeout(instance.update, Physics.framerate, ctx, objects, collider, camera, instance);
    }

    stop() {
        this.continue = false;
    }
}
