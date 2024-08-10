require('../server/gameobjects/squareobject');
require('../server/gameobjects/roundobject');

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

        this.#x = Math.floor(this.#width / this.#density);
        this.#y = Math.floor(this.#height / this.#density);

        this.#map = [];

        this.buildMap();
    }

    get map() { return this.#map; }

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
        let tx = Math.floor(x / this.#density);
        let tY = Math.floor(y / this.#density);
        return this.#map[tx + (ty * this.#x)];
    }

    getOccupiedTilesBySquare(x, y, w, h) {
        let occupiedTiles = [];

        //calculate start and end of square
        let startX = Math.floor(x / this.#density);
        let startY = Math.floor(y / this.#density);
        let endX = Math.floor((x + w) / this.#density);
        let endY = Math.floor((y + h) / this.#density);

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
        let startX = Math.floor((cx - radius) / this.#density);
        let startY = Math.floor((cy - radius) / this.#density);
        let endX = Math.floor((cx + radius) / this.#density);
        let endY = Math.floor((cy + radius) / this.#density);

        // iterate over all tiles in circle
        for (let i = startX; i <= endX; i++) {
            for (let j = startY; j <= endY; j++) {
                // calculate center of tile
                let tileCenterX = i * this.#density + this.#density / 2;
                let tileCenterY = j * this.#density + this.#density / 2;

                // calculate distance between tile center and circle center
                let distX = Math.abs(tileCenterX - cx);
                let distY = Math.abs(tileCenterY - cy);

                // verify if tile is inside circle
                let distance = Math.sqrt(distX * distX + distY * distY);
                if (distance <= radius) {
                    occupiedTiles.push(this.#map[i + j * this.#x]);
                }
            }
        }

        return occupiedTiles;
    }

    zeroMap() {
        for (let i = 0; i < this.#map.length; i++) {
            this.#map[i].walkable = true;
        }
    }

    refreshMap(objectList) {
        this.zeroMap();

        objectList.foreach(obj => {
            if (obj instanceof Soldier || obj instanceof Building) {
                if (obj instanceof SquareObject) {
                    this.getOccupiedTilesBySquare(obj.x, obj.y, obj.width, obj.height).forEach(tile => {
                        tile.walkable = false;
                    });
                } else if (obj instanceof RoundObject) {
                    this.getOccupiedTilesForCircle(obj.x, obj.y, obj.radius).forEach(tile => {
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
            { x: 0, y: -1 }, { x: 0, y: 1 },
            { x: -1, y: -1 }, { x: 1, y: -1 },
            { x: -1, y: 1 }, { x: 1, y: 1 }
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

    aStar(startNode, goalNode) {
        let openList = [];
        let closedList = [];
        openList.push(startNode);

        while (openList.length > 0) {
            let lowIndex = 0;
            for (let i = 0; i < openList.length; i++) {
                if (openList[i].f < openList[lowIndex].f) {
                    lowIndex = i;
                }
            }
            let currentNode = openList[lowIndex];

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

            let neighbors = getNeighbors(currentNode, this.#map);
            for (let neighbor of neighbors) {
                if (!neighbor.walkable || closedList.includes(neighbor)) {
                    continue;
                }

                let tentativeG = currentNode.g + 1;

                if (!openList.includes(neighbor)) {
                    openList.push(neighbor);
                } else if (tentativeG >= neighbor.g) {
                    continue;
                }

                neighbor.g = tentativeG;
                neighbor.h = heurictic(neighbor, goalNode);
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