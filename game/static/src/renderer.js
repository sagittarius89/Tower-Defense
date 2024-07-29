class GraphicsContextWrapper {
    // Constants
    static ASPECT_RATIO = 16 / 9;
    static WIDTH = 3840;
    static HEIGHT = 2160;

    // Private fields
    #ctx;
    #realWidth;
    #realHeight;
    #canvas;
    #x = 0;
    #y = 0;

    constructor() {
        this.#canvas = document.getElementById("canvas");

        if (!this.#canvas) {
            this.#canvas = document.createElement("canvas");
            document.body.appendChild(this.#canvas);

            console.log("Canvas created");
        }

        this.#ctx = canvas.getContext("2d");

        this.recalculateCanvasSize();

        window.addEventListener('resize', () => {
            this.recalculateCanvasSize();
        });
    }

    clearCanvas() {
        this.#ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.#ctx.restore();

        this.#ctx.fillStyle = "black";
        this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height);

        this.#ctx.fillStyle = "white";
        this.#ctx.fillRect(this.#x, this.#y, this.#realWidth, this.#realHeight);
    }

    recalculateCanvasSize() {
        let width = window.innerWidth;
        let height = window.innerHeight;

        this.#canvas.width = width;
        this.#canvas.height = height;

        /*if (width / height > GraphicsContextWrapper.ASPECT_RATIO) {
            width = height * GraphicsContextWrapper.ASPECT_RATIO;
        } else {
            height = width / GraphicsContextWrapper.ASPECT_RATIO;
        }*/

        height = width / GraphicsContextWrapper.ASPECT_RATIO;

        this.#realWidth = width;
        this.#realHeight = height;


        this.#y = (window.innerHeight - height) / 2;

        this.clearCanvas();
    }

    // translate x to real coordinates
    trX(x) {
        return (x / GraphicsContextWrapper.WIDTH) * this.#realWidth;
    }

    // translate y to real coordinates
    trY(y) {
        return this.#y + (y / GraphicsContextWrapper.HEIGHT) * this.#realHeight;
    }

    moveTo(x, y) { this.#ctx.moveTo(this.trX(x), this.trY(y)); }

    lineTo(x, y) { this.#ctx.lineTo(this.trX(x), this.trY(y)); }

    ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
        this.#ctx.ellipse(
            this.trX(x),
            this.trY(y),
            this.trX(radiusX),
            this.trHeight(radiusY),
            rotation,
            startAngle,
            endAngle,
            anticlockwise
        );
    }

    trHeight(height) {
        return (height / GraphicsContextWrapper.HEIGHT) * this.#realHeight;
    }

    restore() {
        this.#ctx.restore();
    }

    setTransform(a, b, c, d, x, y) {
        this.#ctx.setTransform(a, b, c, d, this.trX(x), this.trHeight(y));
    }

    rotate(angle) {
        this.#ctx.rotate(angle);
    }

    translate(x, y) {
        this.#ctx.translate(this.trX(x), this.trY(y));
    }

    // Method to draw a rectangle
    drawRect(x, y, width, height) {
        this.#ctx.fillRect(this.trX(x), this.trY(y), this.trX(width), this.trHeight(height));
    }

    strokeRect(x, y, width, height) {
        this.#ctx.strokeRect(this.trX(x), this.trY(y), this.trX(width), this.trHeight(height));
    }
}


const CTX = new GraphicsContextWrapper();