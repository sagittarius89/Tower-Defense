class Bullet extends RoundObject {
    #vector;
    #parent;

    static BULLET_VELOCITY = 1.5;

    constructor(x, y, vector, parent) {
        super(5, x, y);
        this.#vector = vector;
        this.selectable = false;
        this.#parent = parent;
        this.zIndex = 50;
    }



    update(ctx, objects) {
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        this.x += this.#vector.x;
        this.y += this.#vector.y;

        this.checkCollisions(objects);
    }

    checkCollisions(objects) {
        objects.foreach(obj => {
            if (obj != this.#parent &&
                (obj instanceof Soldier || obj instanceof Building)) {

                let player = obj.getProperty(Player.PLAYER_PROPERTY);

                if (player) {
                    let objPos = new Vector2d(obj.x, obj.y);
                    let myPos = new Vector2d(this.x, this.y);

                    var distance = myPos.getDistance(objPos);

                    if (distance <= this.radius + obj.radius) {
                        obj.lumbago(10);

                        GameContext.engine.objects.delete(this);
                    }
                }
            }
        });
    }
}