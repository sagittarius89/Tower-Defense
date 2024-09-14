class Selection {
    #selectedObj;
    #selectedSoldiers;
    #selectSoliderAction;

    constructor() {
        this.#selectedObj = null;
        this.#selectedSoldiers = [];
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

    get soldierSelection() {
        if (this.#selectedSoldiers == null) {
            this.#selectedSoldiers = [];
        };

        return this.#selectedSoldiers;
    }
    set soldierSelection(value) {
        this.#selectedSoldiers = [];

        if (value instanceof Array) {
            value.forEach((obj) => {
                if (obj instanceof Soldier)
                    this.#selectedSoldiers.push(obj);
            });
        } else {
            console.error("Passed value: " + value + " is not an array");
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

    isSoldierSelected(obj) {
        if (this.#selectedSoldiers == null)
            return false;

        return this.#selectedSoldiers.includes(obj);
    }
}

Selection.instance = new Selection();