const SquareObject = require('./squareobject');
const ResourceManager = require('../resourcemanager').ResourceManager;

module.exports = class Building extends SquareObject {
    #image;
    #imageSelected;
    #currFrame;

    static ACTIONS_PROPERY = "ACTIONS_PROPERY";

    constructor(name, nameSelected, x, y) {
        let tmpImg = ResourceManager.instance.getImageResource(name);

        super(tmpImg.width, tmpImg.height, x, y);

        this.#image = name;
        this.#imageSelected = nameSelected;
        this.#currFrame = 0;

        this.zIndex = 10;
        this.selectable = true;
        this.syncable = true;
    }

    lumbago(value) {
        this.hp -= value;

        if (this.hp <= 0) {

            this.#image = "bang";
            this.#imageSelected = this.#image;

            this.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
                null);
            this.addProperty(Player.PLAYER_PROPERTY,
                null);

            if (Selection.instance.currentSelection == this) {
                Selection.instance.currentSelection = null;
            }

            setTimeout(function () {
                GameContext.engine.objects.delete(this);
            }.bind(this), 1000);

            return true;
        }

        return false;
    }

    toDTO() {
        let dto = super.toDTO();

        dto.image = this.#image;
        dto.imageSelected = this.#imageSelected;

        dto.type = this.constructor.name;

        return dto;
    }

    static fromDTO(dto, obj = new Building(
        dto.image,
        dto.imageSelected,
        dto.x,
        dto.y)) {

        super.fromDTO(dto, obj);

        return obj;
    }

    sync(dto) {
        super.sync(dto)
    }
}