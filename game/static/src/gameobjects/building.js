class Building extends SquareObject {
    #image;

    constructor(name, x, y) {
        let tmpImg = ResourceManager.instance.getImageResource(name);
        super(tmpImg.width, tmpImg.height, x, y);

        this.#image = tmpImg;
        this.zIndex = 10;
        this.selectable = true;
    }

    update(ctx, objects) {
        if (this == Selection.instance.currentSelection) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.15)';
            ctx.beginPath();
            ctx.ellipse(
                this.x + (this.width / 2),
                this.y + (this.height / 2),
                this.width / 2,
                this.height / 2.5,
                0,
                0,
                2 * Math.PI);
            ctx.fill();
            ctx.stroke();

        }

        ctx.drawImage(this.#image, this.x, this.y);
    }

    notify(inputEvent) {
        if (inputEvent.type == MouseEventType.MOUSE_DOWN &&
            Collider.checkCollisionPointWithSquare(
                new Vector2d(inputEvent.x, inputEvent.y),
                new Square(this.x, this.y, this.width, this.height))
        ) {
            console.log("uuid: " + this.id + " clicked");

            Selection.instance.currentSelection = this;
        }
    }
}