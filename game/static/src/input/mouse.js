const MouseEventType = {
    MOUSE_DOWN: 1,
    MOUSE_UP: 2,
    MOUSE_MOVE: 3,
    MOUSE_SCROLL_UP: 4,
    MOUSE_SCROLL_DOWN: 5
}

class MouseEvent {
    #type;
    #x;
    #y;

    constructor(type, x, y) {
        this.#type = type;
        this.#x = x;
        this.#y = y;
    }

    get type() { return this.#type; }
    get x() { return this.#x; }
    get y() { return this.#y; }
}

class Mouse extends InputDevice {
    #eventQueue;

    constructor() {
        super();
        this.#eventQueue = new Queue();

        window.addEventListener('mousedown', e => {
            let x = e.offsetX;
            let y = e.offsetY;

            this.#eventQueue.enqueue(
                new MouseEvent(MouseEventType.MOUSE_DOWN, x, y)
            );
        });

        window.addEventListener('mousemove', e => {
            let x = e.offsetX;
            let y = e.offsetY;

            this.#eventQueue.enqueue(
                new MouseEvent(MouseEventType.MOUSE_MOVE, x, y)
            );
        });

        window.addEventListener('mouseup', e => {
            let x = e.offsetX;
            let y = e.offsetY;

            this.#eventQueue.enqueue(
                new MouseEvent(MouseEventType.MOUSE_UP, x, y)
            );
        });
    }

    get eventQueue() { return this.#eventQueue; }
}