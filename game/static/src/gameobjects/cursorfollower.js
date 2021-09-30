class CursorFollower extends GameObject {
    #position;
    #selection;

    constructor(startPos) {
        this.#position = startPos;
        this.setProperty(InputManager.INPUT_LISTENER_PROPERTY);
    }
    /**
     * 
     * @param {MouseEvent} input 
     */
    notify(event) {

    }

    update(ctx, objects) {

    }
}