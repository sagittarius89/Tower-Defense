class CursorFollower extends GameObject {
    #position;

    constructor(startPos) {
        this.#position = startPos;
        this.setProperty(InputManager.INPUT_LISTENER_PROPERTY);
    }
    /**
     * 
     * @param {InputDevice} input 
     */
    notify(input) {

    }
}