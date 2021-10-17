const GameObjectList = require('../game/static/src/gameobjectlist').GameObjectList;
const Bullet = require('./gameobjects/bullet');
const Soldier = require('./gameobjects/soldier');
const Building = require('./gameobjects/building');
const Tower = require('./gameobjects/towerbuilding');

module.exports = class GameEngine {
    #objects;
    #player1;
    #player2;

    constructor(p1, p2) {

        /** @member {GameObjectList} */
        this.#objects = new GameObjectList();
        this.#player1 = p1;
        this.#player2 = p2;
        this.continue = false;
    }

    /**
     * 
     * @param {GameObject} object 
     */
    addObject(object) {
        this.#objects.push(object);
    }

    get objects() { return this.#objects; }

    get WIDTH() { return this.ctx.canvas.width }
    get HEIGHT() { return this.ctx.canvas.height; }

    endGame(hasPlayer1Objects, hasPlayer2Objects) {

        //setTimeout(function () {
        //    this.continue = false;

        //@todo

        //}.bind(this), 1000);
    }

    sync(dtoList) {
        dtoList.forEach(dto => {
            let obj = this.objects.byId(dto.id);

            if (obj && obj.syncable) {
                obj.sync(dto);
            } else if (!obj) {
                switch (dto.type) {
                    case 'Soldier': {
                        let obj = Soldier.fromDTO(dto);
                        this.addObject(obj);
                        break;
                    }
                    case 'Tower': {
                        let obj = Tower.fromDTO(dto);
                        this.addObject(obj);
                        break;
                    }
                    case 'Bullet': {
                        let obj = Bullet.fromDTO(dto);
                        this.addObject(obj);
                        break;
                    }
                }
            }
        });
    }

    checkWin(objects) {
        let hasPlayer1Objects = false;
        let hasPlayer2Objects = false;

        objects.foreach(element => {
            if (element instanceof Building || element instanceof Soldier) {
                let player = element.owner;
                if (player) {
                    if (player == this.player1) {
                        hasPlayer1Objects = true;
                    } else if (player == this.player2) {
                        hasPlayer2Objects = true;
                    }
                }
            }
        });

        if (!hasPlayer1Objects || !hasPlayer2Objects) {
            this.endGame(hasPlayer1Objects, hasPlayer2Objects);
        }
    }

    update(objects) {
        objects.foreach((obj) => {
            if (obj.x && obj.y
                && (obj.x > this.background.width ||
                    obj.y > this.background.height ||
                    obj.x < 0 || obj.y < 0)
            ) {
                objects.delete(obj);
                return;
            }
        });

        objects.foreach((obj) => {
            obj.logic(objects);
        });

        this.checkWin(objects);

        if (this.continue)
            setTimeout(function () {
                this.update(this.#objects);
            }.bind(this), 17);
    }

    start() {
        this.continue = true;

        setTimeout(function () {
            this.update(this.#objects);
        }.bind(this), 17);
    }

    stop() {
        this.continue = false;
    }
}