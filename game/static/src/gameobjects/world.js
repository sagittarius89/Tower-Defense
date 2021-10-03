class World extends GameObject {
    #image

    constructor() {
        super();

        this.#image = ResourceManager.instance.getImageResource("bg_02");
        this.zIndex = 0;
    }

    update(ctx, objects) {
        ctx.drawImage(this.#image, 0, 0);
    }
}