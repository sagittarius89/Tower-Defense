class GameObject {
    #id;
    #type;
    #name;
    #properties;
    #zIndex;
    #alwaysOnTop;
    #ready;
    #selectable;
    #hp;
    #maxHp;

    constructor() {
        /**@member {String} */
        this.#id = UUID();

        /**@member {String} */
        this.#type = "custom";

        /**@member {Map<String, Object>} */
        this.#properties = {};

        /**@member {bool} */
        this.#ready = false;

        /**@member {bool} */
        this.#selectable = false;

        /**@member {Number} */
        this.#zIndex = 50;

        /**@member {String} */
        this.#name = this.#id;

        /**@member {Number} */
        this.#hp = 0;

        /**@member {Number} */
        this.#maxHp = 0;
    }

    /** @type {String} */
    get id() { return this.#id; }

    /** @type {String} */
    get type() { return this.#type; }

    /** @type {Number} */
    get zIndex() { return this.#zIndex; }

    /** @type {Boolean} */
    get alwaysOnTop() { return this.#alwaysOnTop; }

    /** @type {Boolean} */
    get ready() { return this.#ready; }

    /** @type {Boolean} */
    get selectable() { return this.#selectable; }

    /** @type {String} */
    get name() { return this.#name; }

    set selectable(value) {
        this.#selectable = value ? true : false;
    }

    set alwaysOnTop(value) {
        this.#alwaysOnTop = value ? true : false;
    }

    set ready(value) {
        this.#ready = value ? true : false;
    }

    set zIndex(value) {
        var tmp = Number.parseInt(value);
        this.#zIndex = tmp;
    }

    set name(value) {
        this.#name = value;
    }

    get hp() { return this.#hp; }

    get maxHp() { return this.#maxHp; }

    set hp(value) {
        this.#hp = Number.parseInt(value);
    }

    set maxHp(value) {
        this.#maxHp = Number.parseInt(value);
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
    update(ctx, objects, collider) {
        var colDataA = this.getProperty(Collider.OBJECT_PROPERTY);

        if (colDataA) {
            objects.foreach((objB) => {
                if (this != objB) {
                    var colDataB = objB.getProperty(Collider.OBJECT_PROPERTY);

                    if (colDataB) {
                        collider.checkCollision(this, colDataA, objB, colDataB);
                    }
                }
            });
        }
    }
}