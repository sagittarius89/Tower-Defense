class World extends GameObject {
    #image

    constructor(image) {
        super();

        this.#image = image;
        this.zIndex = 0;
        this.syncable = true;
    }

    update(ctx, objects) {
        let image = ResourceManager.instance.getImageResource(this.#image);

        //ctx.drawImage(image, 0, 0);
        ctx.fillStyle = 'lightblue';
        CTX.drawRect(0, 0, GraphicsContextWrapper.WIDTH, GraphicsContextWrapper.HEIGHT);
    }

    get width() {
        return ResourceManager.instance
            .getImageResource(this.#image).width;
    }
    get height() {
        return ResourceManager.instance
            .getImageResource(this.#image).height;
    }


    toDTO() {
        let dto = super.toDTO();
        dto.image = this.#image;
        dto.type = this.constructor.name;
        dto.width = this.width;
        dto.height = this.height;

        return dto;
    }

    static fromDTO(dto, obj = new World(dto.image)) {
        return super.fromDTO(dto, obj);
    }

    sync(dto) {
        this.#image = dto.image;
    }
}
