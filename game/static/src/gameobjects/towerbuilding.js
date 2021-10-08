class Tower extends Building {
    #productionTimestamp;
    #spawnPoint;
    #spawnFrequency;
    #attackDistance;
    #attackMode;
    #shotFrequency;
    #shotTimestamp;
    #idle;
    #bulletImage;
    #angle;
    #kills;

    get kills() { return this.#kills; }
    set kills(value) { this.#kills = Number.parseInt(value); }

    constructor(pos, spawnPoint, image, imageSelected, bulletImage) {
        super(image, imageSelected, pos.x, pos.y);

        this.#productionTimestamp = new Date();
        this.#spawnFrequency = 3 * 1000;
        this.#spawnPoint = spawnPoint;
        this.#bulletImage = bulletImage;
        this.#attackDistance = 400;
        this.#attackMode = false;
        this.#idle = false;
        this.#shotTimestamp = new Date();
        this.#shotFrequency = 1000;

        this.selectable = true;
        this.hp = 250;
        this.maxHp = 250;
        this.name = "Impulse Tower";
        this.zIndex = 70;
    }

    doShot(objects) {
        let bullet = new Bullet(
            this.#spawnPoint.x,
            this.#spawnPoint.y,
            new Vector2d(
                Bullet.BULLET_VELOCITY * Math.cos(this.#angle),
                Bullet.BULLET_VELOCITY * Math.sin(this.#angle)
            ),
            this,
            this.#bulletImage
        );

        GameContext.engine.addObject(bullet);
    }


    findClostestEnemy(objects) {
        let distance = Number.MAX_VALUE;
        let closestObj = null;

        objects.foreach((obj) => {

            if (obj.getProperty(Player.PLAYER_PROPERTY) &&
                obj.getProperty(Player.PLAYER_PROPERTY)
                != this.getProperty(Player.PLAYER_PROPERTY)) {


                let enemyPos = new Vector2d(obj.x, obj.y);
                let myPos = new Vector2d(this.x, this.y);

                let calculatedD = enemyPos.getDistance(myPos);

                if (calculatedD < distance) {
                    distance = calculatedD;
                    closestObj = obj;
                }
            }
        });

        if (closestObj != null) {

            this.#angle = Math.atan2(
                closestObj.y - this.#spawnPoint.y, closestObj.x - this.#spawnPoint.x
            );

            if (this.#attackDistance > distance) {
                this.#attackMode = true;
            } else {
                this.#attackMode = false;
            }

        } else {
            this.#idle = true;
        }

        return closestObj;
    }

    update(ctx, objects) {
        Building.prototype.update.call(this, ctx, objects);

        let enemy = this.findClostestEnemy(objects);

        let now = new Date();
        if (this.#attackMode &&
            (now.getTime() - this.#shotTimestamp.getTime()
                > this.#shotFrequency)
        ) {

            this.doShot(objects);

            this.#shotTimestamp = new Date();
        }


    }
}