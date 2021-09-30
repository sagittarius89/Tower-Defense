class GameObject {
    #id;
    #type;
    #properties;

    constructor() {
        /**@member {String} */
        this.#id = UUID();

        /**@member {String} */
        this.#type = "custom";

        /**@member {Map<String, Object>} */
        this.#properties = {};
    }

    get id() { return this.#id; }
    get type() { return this.#type; }

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