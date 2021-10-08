class World extends GameObject {
    #image

    constructor() {
        super();

        this.#image = ResourceManager.instance.getImageResource("bg_03");
        this.zIndex = 0;
    }

    update(ctx, objects) {
        ctx.drawImage(this.#image, 0, 0);
    }

    get width() { return this.#image.width; }
    get height() { return this.#image.height; }
}