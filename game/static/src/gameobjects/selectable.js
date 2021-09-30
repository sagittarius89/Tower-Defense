class Selectable {
    #selected;

    get isSelected() { return this.#selected; }
    set selected(value) { this.#selected = value ? true : false; }
}