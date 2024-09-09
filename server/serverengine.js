const GameObjectList = require('../game/static/src/gameobjectlist').GameObjectList;
const Bullet = require('./gameobjects/bullet');
const Soldier = require('./gameobjects/soldier').Soldier;
const Building = require('./gameobjects/building');
const Tower = require('./gameobjects/towerbuilding');
const CONSTS = require('../shared/consts').CONSTS;

module.exports = class GameEngine {
    #objects;
    #player1;
    #player2;
    #conn;
    #end;

    constructor(p1, p2, conn) {

        /** @member {GameObjectList} */
        this.#objects = new GameObjectList();
        this.#player1 = p1;
        this.#player2 = p2;
        this.continue = false;
        this.#conn = conn;
        this.#end = false;
    }

    /**
     * 
     * @param {GameObject} object 
     */
    addObject(object) {
        this.#objects.push(object);
    }

    get objects() { return this.#objects; }

    get end() { return this.#end; }

    get WIDTH() { return this.ctx.canvas.width }
    get HEIGHT() { return this.ctx.canvas.height; }

    endGame(playerName, network) {
        this.continue = false;
        this.#end = true;

        if (network)
            network.endGame(playerName);
    }

    sync(dtoList) {
        dtoList.forEach(dto => {
            let obj = this.objects.byId(dto.id);

            if (obj && obj.syncable) {
                obj.sync(dto);
            } else if (!obj) {
                switch (dto.type) {
                    case 'Tower': {
                        //let obj = Tower.fromDTO(dto);
                        //this.addObject(obj);
                        break;
                    }
                }
            }
        });
    }

    checkWin(objects, network) {
        let hasPlayer1Objects = false;
        let hasPlayer2Objects = false;

        objects.foreach(element => {
            if (element instanceof Building || element instanceof Soldier) {
                let player = element.owner;
                if (player) {
                    if (player == this.#player1) {
                        hasPlayer1Objects = true;
                    } else if (player == this.#player2) {
                        hasPlayer2Objects = true;
                    }
                }
            }
        });

        if (!hasPlayer1Objects) {
            this.endGame(this.#player2.name, network);
        } else if (!hasPlayer2Objects) {
            this.endGame(this.#player1.name, network);
        }
    }

    update(objects) {

        if (this.continue)
            objects.foreach((obj) => {
                if (obj.x && obj.y
                    && (obj.x > CONSTS.GFX.ABS_WIDTH ||
                        obj.y > CONSTS.GFX.ABS_HEIGHT ||
                        obj.x < 0 || obj.y < 0)
                ) {
                    objects.delete(obj);
                    return;
                }
            });


        if (this.continue)
            objects.foreach((obj) => {
                obj.logic(objects, this.#conn, this.aStrPthFnd, this.continue);
            });

        this.checkWin(objects, this.#conn);

        if (this.continue)
            setTimeout(function () {
                this.update(this.#objects);
            }.bind(this), CONSTS.FRAME_RATE);
    }

    updateAStarMap(objects) {
        this.aStrPthFnd.refreshMap(objects);
        objects.foreach((obj) => {
            if (obj instanceof Soldier) {
                obj.solveAngle(objects, this.aStrPthFnd);
            }
        });

        setTimeout(function () {
            this.updateAStarMap(this.#objects);
        }.bind(this), 50);
    }

    start() {
        this.continue = true;

        setTimeout(function () {
            this.update(this.#objects);
        }.bind(this), 17);

        setTimeout(function () {
            this.updateAStarMap(this.#objects);
        }.bind(this), 10);
    }

    stop() {
        this.continue = false;
    }

    resume() {
        this.continue = true;
    }
}