const GameObject = require('../gameobject');
const ResourceManager = require('../resourcemanager').ResourceManager;

module.exports = class World extends GameObject {
    #image
    #width;
    #height;

    constructor(image) {
        super();

        this.#image = image;
        this.#width;
        this.#height;

        this.zIndex = 0;
        this.syncable = true;
    }

    update(ctx, objects) {
        let image = ResourceManager.instance.getImageResource(this.#image);

        ctx.drawImage(image, 0, 0);
    }

    get width() {
        return this.#width;
    }
    get height() {
        return this.#height;
    }


    toDTO() {
        let dto = super.toDTO();
        dto.image = this.#image;

        dto.type = this.constructor.name;
        return dto;
    }

    static fromDTO(dto, obj = new World(dto.image)) {
        super.fromDTO(dto, obj);
        obj.#width = dto.width;
        obj.#height = dto.height;

        return obj;
    }

    sync(dto) {
        this.#image = dto.image;
    }
}
