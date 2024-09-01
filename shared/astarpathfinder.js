var SquareObjectR = require('../server/gameobjects/squareobject');
var RoundObjectR = require('../server/gameobjects/roundobject');
var SoldierR = require('../server/gameobjects/soldier');
var BuildingR = require('../server/gameobjects/building');
const { PerformanceObserver, performance } = require('perf_hooks');

// if we are in nodejs environment do a override
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    Soldier = SoldierR;
    Building = BuildingR;
    SquareObject = SquareObjectR;
    RoundObject = RoundObjectR;
}

class Node {
    constructor(x, y, walkable = true) {
        this.x = x;
        this.y = y;
        this.walkable = walkable;
        this.g = 0; // cost from start to this node
        this.h = 0; // heuristic cost to goal
        this.f = 0; // total sum f = g + h
        this.parent = null;
    }
}

class AStarPathFinder {
    #width; // real map width 
    #height; // real map height
    #density; // net density
    #x; // map width in nodes 
    #y; // map height in nodes
    #map; // map of nodes

    constructor(width, height, density) {
        this.#width = width;
        this.#height = height;
        this.#density = density;

        this.#x = Math.round(this.#width / this.#density);
        this.#y = Math.round(this.#height / this.#density);

        this.#map = [];

        this.buildMap();
    }

    get map() { return this.#map; }

    trX(x) {
        return x * this.#density;
    }

    trY(y) {
        return y * this.#density;
    }

    width() {
        return this.#width;
    }

    height() {
        return this.#height;
    }

    heurictic(a, b) {
        // heurictic Manhattan
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    buildMap() {
        for (let y = 0; y < this.#y; y++) {
            for (let x = 0; x < this.#x; x++) {
                this.#map.push(new Node(x, y));
            }
        }
    }

    getTile(x, y) {
        let tx = Math.round(x / this.#density);
        let ty = Math.round(y / this.#density);
        return this.#map[tx + (ty * this.#x)];
    }

    tilifyObject(obj) {
        if (obj instanceof SquareObject) {
            return this.getOccupiedTilesBySquare(obj.x, obj.y, obj.width, obj.height);
        } else if (obj instanceof Soldier) {
            return [this.getTile(obj.x, obj.y)];
        } else if (obj instanceof RoundObject) {
            return this.getOccupiedTilesForCircle(obj.x, obj.y, obj.radius);
        }
    }

    checkObjsObjCollision(objectList, obj) {
        let tiles = this.tilifyObject(obj);
        let result = false;


        objectList.foreach(iter => {
            if (iter == obj)
                return;

            if (iter instanceof Soldier || iter instanceof Building) {
                let ownTiles = this.tilifyObject(iter);

                for (let tile of tiles) {
                    if (ownTiles.includes(tile)) {
                        result = true;
                        return true;
                    }
                }
            }
        });

        return result;
    }

    getOccupiedTilesBySquare(x, y, w, h) {
        let occupiedTiles = [];

        //calculate start and end of square
        let startX = Math.round((x - 0.49 * w) / this.#density);
        let startY = Math.round((y - 0.49 * h) / this.#density);
        let endX = Math.round((x + 0.49 * w) / this.#density);
        let endY = Math.round((y + 0.49 * h) / this.#density);

        // iterate over all tiles in square
        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                occupiedTiles.push(this.#map[i + j * this.#x]);
            }
        }

        return occupiedTiles;
    }

    getOccupiedTilesForCircle(cx, cy, radius) {
        let occupiedTiles = [];

        // calculate circle bounds
        let startX = Math.round((cx - radius) / this.#density);
        let startY = Math.round((cy - radius) / this.#density);
        let endX = Math.round((cx + radius) / this.#density);
        let endY = Math.round((cy + radius) / this.#density);

        // iterate over all tiles in circle
        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                // calculate center of tile
                //let tileCenterX = i * this.#density + this.#density / 2;
                //let tileCenterY = j * this.#density + this.#density / 2;

                // calculate distance between tile center and circle center
                //let distX = Math.abs(tileCenterX - cx);
                //let distY = Math.abs(tileCenterY - cy);

                // verify if tile is inside circle
                //let distance = Math.sqrt(distX * distX + distY * distY);
                //if (distance <= radius) {
                //    occupiedTiles.push(this.#map[i + j * this.#x]);
                //}

                occupiedTiles.push(this.#map[i + j * this.#x]);
            }
        }

        return occupiedTiles;
    }

    zeroMap() {
        for (let i = 0; i < this.#map.length; i++) {
            this.#map[i].walkable = true;
            this.#map[i].g = this.#map[i].h = this.#map[i].f = 0;
            this.#map[i].parent = null;
        }
    }

    cleanupWages() {
        for (let i = 0; i < this.#map.length; i++) {
            this.#map[i].g = this.#map[i].h = this.#map[i].f = 0;
            this.#map[i].parent = null;
        }
    }

    refreshMap(objectList) {
        this.zeroMap();

        objectList.foreach(obj => {
            if (obj instanceof Soldier || obj instanceof Building) {
                if (obj instanceof SquareObject) {
                    this.getOccupiedTilesBySquare(obj.x, obj.y, obj.width, obj.height).forEach(tile => {
                        if (tile)
                            tile.walkable = false;
                    });
                } else if (obj instanceof Soldier) {
                    let tile = this.getTile(obj.x, obj.y);
                    if (tile)
                        tile.walkable = false;
                } else if (obj instanceof RoundObject) {
                    this.getOccupiedTilesForCircle(obj.x, obj.y, obj.radius).forEach(tile => {
                        if (tile)
                            tile.walkable = false;
                    });
                }
            }
        });
    }

    getNeighbors(node, map) {
        let neighbors = [];
        let directions = [
            { x: -1, y: 0 }, { x: 1, y: 0 },
            { x: 0, y: -1 }, { x: 0, y: 1 }

            //bias
            //{ x: -1, y: -1 }, { x: 1, y: -1 },
            //{ x: -1, y: 1 }, { x: 1, y: 1 }
        ];

        for (let dir of directions) {
            let x = node.x + dir.x;
            let y = node.y + dir.y;
            let neighbor = map.find(n => n.x === x && n.y === y);
            if (neighbor) {
                neighbors.push(neighbor);
            }
        }

        return neighbors;
    }

    printMap() {
        let str = "";
        for (let y = 0; y < this.#y; y++) {
            for (let x = 0; x < this.#x; x++) {
                let node = this.#map[x + y * this.#x];
                str += node.walkable ? "." : "X";
            }
            str += "\n";
        }

        console.log(str);
    }

    aStar(startNode, goalNode, ignoreObjs = []) {

        if (!startNode || !goalNode)
            return [];

        if (startNode.x < 0 || startNode.y < 0 || goalNode.x < 0 || goalNode.y < 0)
            return [];

        if (startNode.x >= this.#x || startNode.y >= this.#y || goalNode.x >= this.#x
            || goalNode.y >= this.#y)
            return [];



        this.cleanupWages();

        let openList = [];
        let closedList = [];
        openList.push(startNode);

        while (openList.length > 0) {
            let lowIndex = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i] && openList[i].f < openList[lowIndex].f) {
                    lowIndex = i;
                }
            }
            let currentNode = openList[lowIndex];

            if (!currentNode)
                continue;


            if (currentNode.x === goalNode.x && currentNode.y === goalNode.y) {
                let path = [];
                let curr = currentNode;
                while (curr.parent) {
                    path.push(curr);
                    curr = curr.parent;
                }

                path.push(startNode);
                return path.reverse();
            }

            openList.splice(lowIndex, 1);
            closedList.push(currentNode);

            let neighbors = this.getNeighbors(currentNode, this.#map);
            for (let neighbor of neighbors) {

                let affectedObjs = neighbor == startNode || neighbor == goalNode;
                ignoreObjs.forEach(obj => {
                    if (obj instanceof Soldier || obj instanceof Building) {
                        if (obj instanceof SquareObject) {
                            this.getOccupiedTilesBySquare(obj.x, obj.y, obj.width, obj.height).forEach(tile => {
                                if (tile == neighbor)
                                    affectedObjs = true;
                            });
                        } else if (obj instanceof Soldier) {
                            let tile = this.getTile(obj.x, obj.y);
                            if (tile == neighbor)
                                affectedObjs = true;
                        } else if (obj instanceof RoundObject) {
                            this.getOccupiedTilesForCircle(obj.x, obj.y, obj.radius).forEach(tile => {
                                if (tile == neighbor)
                                    affectedObjs = true;
                            });
                        }
                    }
                });


                if (!(neighbor.walkable || affectedObjs) || closedList.includes(neighbor)) {
                    continue;
                }

                let tentativeG = currentNode.g + 1;

                if (!openList.includes(neighbor)) {
                    openList.push(neighbor);
                } else if (tentativeG >= neighbor.g) {
                    continue;
                }

                neighbor.g = tentativeG;
                neighbor.h = this.heurictic(neighbor, goalNode);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = currentNode;
            }
        }

        return [];
    }
}


try {
    module.exports.AStarPathFinder = AStarPathFinder;
} catch (e) { }