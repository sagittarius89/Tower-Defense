class Selection {
    #selectedObj;
    #selectedSoldiers;
    #selectSoliderAction;

    constructor() {
        this.#selectedObj = null;
        this.#selectedSoldiers = null;
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

    get soldierSelection() { return this.#selectedSoldiers; }
    set soldierSelection(value) {
        if (value == null) {
            this.#selectedSoldiers = null;
        }
        else if (value instanceof Soldier)
            this.#selectedSoldiers = value;
        else {
            this.#selectedSoldiers = null;
            console.error("Passed value: " + value + " is not selected soldier");
        }
    }

    get selectSoliderAction() { return this.#selectSoliderAction; }
    set selectSoliderAction(value) {
        if (value == null) {
            this.#selectSoliderAction = null;
        }
        else if (value instanceof GameAction)
            this.#selectSoliderAction = value;
        else {
            this.#selectSoliderAction = null;
            console.error("Passed value: " + value + " is not select solider action");
        }
    }
}

Selection.instance = new Selection();