const MouseEventType = {
    MOUSE_DOWN: 1,
    MOUSE_UP: 2,
    MOUSE_MOVE: 3,
    MOUSE_SCROLL_UP: 4,
    MOUSE_SCROLL_DOWN: 5,
    MOUSE_RIGHT_CLICK: 6,
    MOUSE_DBCLICK: 7
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

        window.addEventListener("dblclick", (event) => {
            let x = e.offsetX;
            let y = e.offsetY;

            if (e.deltaY < 0) {
                this.#eventQueue.enqueue(
                    new MouseEvent(MouseEventType.MOUSE_DBCLICK, x, y)
                );
            } else {
                this.#eventQueue.enqueue(
                    new MouseEvent(MouseEventType.MOUSE_DBCLICK, x, y)
                );
            }
        });

        window.addEventListener('contextmenu', e => {
            e.preventDefault(); // Prevent the default context menu from appearing
            let x = e.offsetX;
            let y = e.offsetY;

            this.#eventQueue.enqueue(
                new MouseEvent(MouseEventType.MOUSE_RIGHT_CLICK, x, y)
            );
        });
    }

    get eventQueue() { return this.#eventQueue; }
}