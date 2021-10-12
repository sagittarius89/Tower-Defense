const { Player } = require("../../../shared/player");

class GameObject {
    #id;
    #type;
    #name;
    #properties;
    #zIndex;
    #selectable;
    #syncable;
    #hp;
    #maxHp;
    #owner;

    constructor() {
        /**@member {String} */
        this.#id = UUID();

        /**@member {String} */
        this.#type = "custom";

        /**@member {Map<String, Object>} */
        this.#properties = {};

        /**@member {bool} */
        this.#selectable = false;

        /**@member {bool} */
        this.#syncable = false;

        /**@member {Number} */
        this.#zIndex = 50;

        /**@member {String} */
        this.#name = this.#id;

        /**@member {Number} */
        this.#hp = 0;

        /**@member {Number} */
        this.#maxHp = 0;

        /**@member {Player} */
        this.#owner = null;
    }

    /** @type {String} */
    get id() { return this.#id; }

    /** @type {String} */
    get type() { return this.#type; }

    /** @type {Number} */
    get zIndex() { return this.#zIndex; }

    /** @type {Boolean} */
    get ready() { return this.#ready; }

    /** @type {Boolean} */
    get selectable() { return this.#selectable; }

    /** @type {String} */
    get name() { return this.#name; }

    /** @type {Number} */
    get hp() { return this.#hp; }

    /** @type {Number} */
    get maxHp() { return this.#maxHp; }

    /** @type {Player} */
    get player() { return this.#owner; }

    /** @type {Boolean} */
    get syncable() { return this.#syncable; }

    set selectable(value) {
        this.#selectable = value ? true : false;
    }

    set zIndex(value) {
        var tmp = Number.parseInt(value);
        this.#zIndex = tmp;
    }

    set name(value) {
        this.#name = value;
    }

    set hp(value) {
        this.#hp = Number.parseInt(value);
    }

    set maxHp(value) {
        this.#maxHp = Number.parseInt(value);
    }

    set owner(value) {
        if (value instanceof Player)
            this.#owner = value;
    }

    set syncable(value) {
        this.#syncable = new Boolean(value);
    }

    /**
     * @param {String} name 
     * @param {Object} value
     */
    addProperty(name, value) {
        return this.#properties[name] = value;

    }

    /**
     * 
     * @param {String} name 
     */
    removeProperty(name) {
        delete this.#properties[name];
    }

    /** 
     * @param {String} name;
     */
    getProperty(name) {
        return this.#properties[name];
    }

    /** this method would be executed at each cycle of game 
     *  @param {CanvasRenderingContext2D} ctx
     *  @param {GameObjectList} objects
     */
    update(ctx, objects) {

    }

    logic(objetcs) {

    }

    toDTO() {
        let dto = {};

        dto.id = this.#id;
        dto.type = this.#type;
        dto.name = this.#name;
        dto.properties = this.#properties;
        dto.zIndex = this.#zIndex;
        dto.selectable = this.#selectable;
        dto.hp = this.#hp;
        dto.maxHp = this.#maxHp;
        dto.owner = this.#owner;
        dto.syncable = this.#syncable;
    }

    static fromDTO(dto, obj = new GameObject()) {
        obj.id = dto.id;
        obj.type = dto.type;
        obj.name = dto.name;
        obj.properties = dto.properties;
        obj.zIndex = dto.zIndex;
        obj.selectable = dto.selectable;
        obj.hp = dto.hp;
        obj.maxHp = dto.maxHp;
        obj.owner = dto.owner;
        obj.syncable = dto.#syncable;
    }

    sync(dto) {
        this.#zIndex = dto.zIndex;
        this.#selectable = dto.selectable;
        this.#hp = dto.hp;
        this.#maxHp = dto.maxHp;
    }
}