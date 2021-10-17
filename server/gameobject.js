const Player = require("../shared/player").Player;

function UUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

module.exports = class GameObject {
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

    get owner() {
        return this.#owner;
    }

    set syncable(value) {
        this.#syncable = Boolean(value);
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
        dto.zIndex = this.#zIndex;
        dto.selectable = this.#selectable;
        dto.hp = this.#hp;
        dto.maxHp = this.#maxHp;
        dto.owner = this.#owner ? this.#owner.toDTO() : null;
        dto.syncable = this.#syncable;


        dto.type = this.constructor.name;

        return dto;
    }

    static fromDTO(dto, obj = new GameObject()) {
        obj.#id = dto.id;
        obj.#type = dto.type;
        obj.#name = dto.name;
        obj.#zIndex = dto.zIndex;
        obj.#selectable = dto.selectable;
        obj.#hp = dto.hp;
        obj.#maxHp = dto.maxHp;
        obj.#owner = dto.owner ? Player.fromDTO(dto.owner) : null;
        obj.#syncable = dto.syncable;
    }

    sync(dto) {
        this.#zIndex = dto.zIndex;
        this.#selectable = dto.selectable;
        this.#hp = dto.hp;
        this.#maxHp = dto.maxHp;
    }
}