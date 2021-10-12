const { Player } = require("../../../../shared/player");

class CreateTower extends GameAction {
    #towerImage;
    #towerImageSelected;
    #bulletImage;
    #player;

    constructor(callback, towerImage, towerImageSelected, bulletImage, player) {
        super(callback);

        this.#towerImage = towerImage;
        this.#towerImageSelected = towerImageSelected;
        this.#bulletImage = bulletImage;
        this.#player = player;
    }

    update(ctx, objects) {
        let image = ResourceManager.instance.getImageResource(this.#towerImage);

        ctx.globalAlpha = 0.3;

        ctx.setTransform(1, 0, 0, 1,
            GameContext.inputManager.mousePosX,
            GameContext.inputManager.mousePosY);

        ctx.drawImage(
            image,
            -image.width / 2,
            -image.height / 2);

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.restore();
        ctx.globalAlpha = 1;
    }

    mouseUp() {
        super.stop();

        let tower = new Tower(
            new Vector2d(GameContext.inputManager.mousePosX,
                GameContext.inputManager.mousePosY),
            new Vector2d(GameContext.inputManager.mousePosX,
                GameContext.inputManager.mousePosY),
            this.#towerImage,
            this.#towerImageSelected,
            this.#bulletImage
        );

        tower.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
            this.#player);

        tower.addProperty(Player.PLAYER_PROPERTY,
            this.#player);

        GameContext.engine.addObject(tower);

        this.callback();
    }
}


class CommandCenterBuilding extends Building {
    #productionTimestamp;
    #spawnPoint;
    #spawnFrequency;
    #soldierLimit;
    #dronImage;
    #bulletImage;

    constructor(pos, spawnPoint, player,
        image, imageSelected,
        dronImage, bulletImage,
        towerImage, towerImageSelected) {

        super(image, imageSelected, pos.x, pos.y);

        this.#productionTimestamp = new Date();
        this.#spawnFrequency = 3 * 1000;
        this.#spawnPoint = spawnPoint;
        this.#soldierLimit = 15;
        this.#dronImage = dronImage;
        this.#bulletImage = bulletImage;

        this.owner = player;
        this.selectable = true;
        this.syncable = true;
        this.hp = 1000;
        this.maxHp = 1000;
        this.name = "Command Center";
        this.zIndex = 30;

        let actionsList = [];

        let towerAction = new Button(
            "build tower", CreateTower,
            [towerImage, towerImageSelected, bulletImage, this.owner],
            420, 750, 50, 50, "turret_violet_01", 25, true
        );

        actionsList.push(towerAction);

        this.addProperty(Building.ACTIONS_PROPERY, actionsList);
    }

    produceNewSoldier() {
        let soldier = new Soldier(this.#spawnPoint.x, this.#spawnPoint.y,
            this.#dronImage, this.#bulletImage, this.owner);

        soldier.addProperty(InputManager.INPUT_LISTENER_PROPERTY,
            this.getProperty(InputManager.INPUT_LISTENER_PROPERTY));

        GameContext.engine.addObject(soldier);
    }

    soldierCount(objects) {
        let count = 0;
        objects.foreach((obj) => {
            if (obj instanceof Soldier && obj.owner == this.owner) {
                count++;
            }
        });

        return count;
    }

    update(ctx, objects) {
        super.update(ctx, objects);
    }

    logic(objects) {
        let now = new Date();

        if (now.getTime() - this.#productionTimestamp.getTime()
            > this.#spawnFrequency &&
            this.#soldierLimit > this.soldierCount(objects)) {

            this.produceNewSoldier();

            this.#productionTimestamp = new Date();
        }
    }

    toDTO() {
        let dto = super.toDTO();

        dto.productionTimestamp = this.#productionTimestamp;
        dto.spawnPoint = Vector2d.toDTO(this.#spawnPoint);
        dto.spawnFrequency = this.#spawnFrequency;
        dto.soldierLimit = this.#soldierLimit;
        dto.dronImage = this.#dronImage;
        dto.bulletImage = this.#bulletImage;
        return dto;
    }

    static fromDTO(dto, obj = new CommandCenterBuilding(
        Vector2d.fromDTO(dto.pos),
        Vector2d.fromDTO(dto.spawnPoint),
        Player.fromDTO(dto.owner),
        obj.image, obj.imageSelected, obj.dronImage, obj.bulletImage,
        obj.towerImage, obj.towerImageSelected
    )) {

        super.fromDTO(dto, obj);

        obj.productionTimestamp = this.#productionTimestamp;
        obj.spawnFrequency = this.#spawnFrequency;
        obj.soldierLimit = this.#soldierLimit;
        obj.dronImage = this.#dronImage;
        obj.bulletImage = this.#bulletImage;

        return obj;
    }

    sync(dto) {
        super.sync(dto);

        this.#productionTimestamp = dto.productionTimestamp;
        this.#spawnPoint = Vector2d.fromDTO(dto.spawnPoint);
        this.#spawnFrequency = dto.spawnFrequency;
        this.#soldierLimit = dto.soldierLimit;
        this.#dronImage = dto.dronImage;
        this.#bulletImage = dto.bulletImage;
    }
}