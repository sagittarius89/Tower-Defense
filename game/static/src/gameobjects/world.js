class World extends GameObject {
    #image

    constructor(image) {
        super();

        this.#image = new Image();
        this.#image.src = image;
        this.#image.onload = function () {
            this.ready = true;
        }
    }

    update(ctx, objects) {
        ctx.drawImage(this.#image, 0, 0);
    }
}