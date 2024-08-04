class BlackHole extends Building {
    #sibling;

    constructor(pos, image, imageSelected, sibling) {
        super(image, imageSelected, pos.x, pos.y, true);

        this.#sibling = sibling;

        this.hp = CONSTS.TOWER.HP;
        this.maxHp = CONSTS.TOWER.HP;

        this.selectable = true;
        this.name = "Black Hole";
        this.zIndex = 70;
    }

    set sibling(value) { this.#sibling = value; }
    get sibling() { return this.#sibling; }

    update(ctx, objects) {
        super.update(ctx, objects);
    }

    logic(objects) {

    }

    toDTO() {
        let dto = super.toDTO();

        dto.sibling = this.#sibling ? this.#sibling : null;

        dto.type = this.constructor.name;
        return dto;
    }

    static fromDTO(dto, obj = new BlackHole(
        new Vector2d(dto.x, dto.y),
        dto.image,
        dto.imageSelected,
        dto.sibling)
    ) {
        super.fromDTO(dto, obj);

        obj.#sibling = dto.sibling;

        return obj;
    }

    sync(dto) {
        super.sync(dto);
    }
}