class Camera extends GameObject {
    #position;
    #pinedobj;
    #screenheight;
    #screenwidth;

    constructor(vector) {
        super();

        this.#position = vector;
    }

    get x() { return this.#position.x - (this.#screenwidth / 2); }
    get y() { return this.#position.y - (this.#screenheight / 2); }
    get position() { return this.#position; }

    set position(vector) { this.#position = vector; }

    /** 
     * @param {GameObject} attachable game object with position field
      */
    attachToObject(attachable) {
        this.#pinedobj = attachable;
    }

    detach() {
        this.#pinedobj = null;
    }

    update(ctx, objects, collider) {
        this.#screenheight = ctx.canvas.height;
        this.#screenwidth = ctx.canvas.width;

        if (this.#pinedobj)
            this.#position = this.#pinedobj.position;
    }
}