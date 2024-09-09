const Building = require('./building');
const Vector2d = require('../../game/static/src/math/vector').Vector2d;
const Soldier = require('./soldier').Soldier;
const CONSTS = require('../../shared/consts').CONSTS;

module.exports = class BlackHole extends Building {
    #sibling;

    constructor(pos, image, imageSelected, sibling) {
        super(image, imageSelected, pos.x, pos.y, true);

        this.#sibling = sibling;

        this.hp = CONSTS.TOWER.HP;
        this.maxHp = CONSTS.TOWER.HP;

        this.selectable = true;
        this.name = "Black Hole";
        this.zIndex = 50;
    }

    set sibling(value) { this.#sibling = value; }
    get sibling() { return this.#sibling; }

    logic(objects, network) {
        if (this.#sibling && objects.byId(this.#sibling)) {
            let sib = objects.byId(this.#sibling);
            objects.foreach(obj => {
                if (obj instanceof Soldier) {
                    let objPos = new Vector2d(obj.x, obj.y);
                    let myPos = this.pos;

                    var distance = myPos.getDistance(objPos);

                    if (distance <= this.width + obj.radius) {
                        network.updatePosition(obj.id, sib.pos);
                    }
                }
            });
        }
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