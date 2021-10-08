class Selection {
    #selectedObj;

    constructor() {
        this.#selectedObj = null;
    }

    get currentSelection() { return this.#selectedObj; }
    set currentSelection(value) {
        if (value == null) {
            this.#selectedObj = null;
        }
        else if (value instanceof GameObject)
            this.#selectedObj = value;
        else {
            this.#selectedObj = null;
            console.error("Passed value: " + value + " is not selected obj");
        }
    }
}

Selection.instance = new Selection();