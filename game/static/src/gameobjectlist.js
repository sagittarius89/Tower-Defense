class GameObjectList {
    #list;

    constructor() {

        /** @member {GameObject[]} */
        this.#list = [];
    }

    get length() {
        return this.#list.length;
    }

    /**
     *  @param {GameObject} object
     *  @returns {boolean} true if added false if not
     */
    push(object) {
        let result = false;

        for (var i = 0; i < this.#list.length; ++i) {
            if (this.#list[i].id == object.id) {
                return false;
            }
        }

        this.#list.push(object);
        this.#list.sort(function (a, b) { return a.zIndex - b.zIndex });

        return true;
    }

    /**
     * @param {number} object 
     * @returns {boolean} true if removed
     */
    delete(object) {
        const index = this.#list.indexOf(object);
        if (index > -1) {
            this.#list.splice(index, 1);

            return true;
        }
        else {
            return false;
        }
    }

    /**
     * @param {number} n
     */
    at(n) {
        if (this.#list.length < n)
            return this.#list[n];
        else
            return null;
    }

    /**
     * @param {function} func 
     */
    foreach(func) {
        for (var i = 0; i < this.#list.length; ++i) {
            func(this.#list[i]);
        }
    }

    clear() {
        this.#list.clear();
    }

    /**
     * @param {string} uuid 
     */
    byId(uuid) {
        for (var i = 0; i < this.#list.length; ++i) {
            if (this.#list[i].id == uuid) {
                return this.#list[i];
            }
        }

        return null;
    }
}

try {
    module.exports = {
        GameObjectList
    }
} catch (e) { }